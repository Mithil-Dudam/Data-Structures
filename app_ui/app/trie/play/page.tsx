"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type TrieNode = {
  char: string;
  is_end_of_word: boolean;
  children: TrieNode[];
};

type PositionedNode = TrieNode & { x: number; y: number; parentX?: number; parentY?: number };

function getSubtreeWidth(node: TrieNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0);
}

function layoutTrie(
  node: TrieNode,
  x: number,
  y: number,
  parentX?: number,
  parentY?: number
): PositionedNode[] {
  const levelGap = 100;
  const siblingGap = 80;

  const nodes: PositionedNode[] = [];

  const width = getSubtreeWidth(node);
  let currentX = x - (width * siblingGap) / 2;

  nodes.push({ ...node, x, y, parentX, parentY });

  node.children.forEach((child) => {
    const childWidth = getSubtreeWidth(child);
    const childX = currentX + (childWidth * siblingGap) / 2;

    nodes.push(
      ...layoutTrie(
        child,
        childX,
        y + levelGap,
        x,
        y
      )
    );

    currentX += childWidth * siblingGap;
  });

  return nodes;
}

const TrieSVG: React.FC<{ root: TrieNode }> = ({ root }) => {
  const nodes = layoutTrie(root, 600, 50);

  const maxX = Math.max(...nodes.map(n => n.x)) + 100;
  const maxY = Math.max(...nodes.map(n => n.y)) + 100;

  return (
    <svg width={maxX} height={maxY}>
      <defs>
        <radialGradient id="nodeGradient">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>

        <filter id="glow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#facc15" />
        </filter>
      </defs>

      {/* Curved edges */}
      {nodes.map((node, idx) =>
        node.parentX !== undefined && node.parentY !== undefined ? (
          <path
            key={`line-${idx}`}
            d={`M ${node.parentX} ${node.parentY}
                C ${node.parentX} ${(node.parentY + node.y) / 2},
                  ${node.x} ${(node.parentY + node.y) / 2},
                  ${node.x} ${node.y}`}
            stroke="#facc15"
            fill="transparent"
            strokeWidth={2}
            opacity={0.8}
          />
        ) : null
      )}

      {/* Nodes */}
      {nodes.map((node, idx) => (
        <g key={`node-${idx}`} filter="url(#glow)">
          <circle
            cx={node.x}
            cy={node.y}
            r={22}
            fill="url(#nodeGradient)"
            stroke={node.char === "*" ? "#22c55e" : "#facc15"}
            strokeWidth={3}
          />

          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="#facc15"
            fontSize="16"
            fontWeight="bold"
          >
            {node.char}
          </text>

          {/* End-of-word indicator */}
          {node.is_end_of_word && (
            <circle
              cx={node.x + 18}
              cy={node.y - 18}
              r={6}
              fill="#22c55e"
              stroke="black"
              strokeWidth={1}
            />
          )}
        </g>
      ))}
    </svg>
  );
};

export default function Play() {
    const router = useRouter()
    const [error, setError] = useState<string|null>(null)
    const [sessionID, setSessionID] = useState<string|null>(null)
    const [options, setOptions] = useState(0)
    const [word, setWord] = useState("")
    const [message, setMessage] = useState<string|null>(null)
    const [elements, setElements] = useState<TrieNode | null>(null)
    const [words, setWords] = useState<string[]>([])
    const [wordsFetched, setWordsFetched] = useState(false);

    useEffect(() => {
        const createTrie = async () => {
            const storedSession = sessionStorage.getItem("session_id")
            if (storedSession){
                setSessionID(storedSession)
                const storedElements = sessionStorage.getItem("trie_elements")
                if (storedElements){
                    setElements(JSON.parse(storedElements))
                    return 
                }
                await fetch("http://localhost:8000/trie/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_id: storedSession
                    })
                })
                return
            }
            router.push("/")
        }
        createTrie()
    }, [])

    const ChangeOptions = () => {
        setWord("")
        setMessage(null)
        setWords([])
        setWordsFetched(false)
    }

    const insert = async () => {
        if (word === "") {
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/trie/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                word:word,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("trie_elements", JSON.stringify(data.elements))
        }else{
            setError("An error occurred while inserting the word")
        }
    }

    const deleteWord = async () => {
        if (word === "") {
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/trie/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                word: word
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("trie_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const search = async () => {
        if (word === "") {
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/trie/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                word: word
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
        }else{
            setError("An error occurred while searching the word")
        }
    }

    const hasPrefix = async () => {
        if (word === ""){
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/trie/has-prefix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                word: word
            })
        }) 
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
        }else{
            setError("An error occurred while checking the prefix")
        }
    }

    const startsWith = async () => {
        setError(null);
        setMessage(null);
        setWordsFetched(false);
        const response = await fetch("http://localhost:8000/trie/starts-with", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionID, word: word })
        });
        const data = await response.json();
        setWordsFetched(true);
        if (response.status === 200) {
            setWords(data.words);
        } else {
            setError("An error occurred while fetching the words with the given prefix");
        }
    };

    const allWords = async () => {
        setError(null);
        setMessage(null);
        setWordsFetched(false);
        const response = await fetch("http://localhost:8000/trie/list-words", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionID })
        });
        const data = await response.json();
        setWordsFetched(true);
        if (response.status === 200) {
            setWords(data.words);
        } else {
            setError("An error occurred while fetching all the words in the trie");
        }
    };

    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg w-[70%]">
            <h2 className="text-2xl text-center">You can select your options here and view how the trie behaves</h2>
            <div className="flex justify-between my-5">
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 0 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(0); ChangeOptions()}}>Insert Word</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 1 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(1); ChangeOptions()}}>Delete Word</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 2 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(2); ChangeOptions()}}>Search Word</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 3 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(3); ChangeOptions()}}>Search Prefix</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 4 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(4); ChangeOptions()}}>Word&apos;s starting with ...</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 5 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(5); ChangeOptions(); allWords()}}>List all words</button>
            </div>
            {(options === 0 || options === 1 || options === 2 || options === 3 || options === 4) && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter {(options !== 3 && options !== 4) ? "word" : "prefix"} to {options === 0 ? "insert" : options === 1 ? "delete" : "search"}</label>
                        <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={options === 0 ? insert : options === 1 ? deleteWord : options === 2 ? search : options === 3 ? hasPrefix : startsWith} disabled={word === ""}>{options === 0 ? "Insert" : options === 1 ? "Delete" : (options === 2 || options === 3) ? "Search" : "Search All Words"}</button>
                </div>
            </div>
            }
            <div className="mt-5">
                {message && <p className={`text-center mb-3 font-semibold ${message === "False" ? "text-red-500" : "text-green-500"}`}>{message}</p>}
                {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
                {wordsFetched && words.length === 0 && (
                    <div className="text-red-500 text-center mb-4 font-semibold">No words found</div>
                    )}
                    {words.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {words.map((w, idx) => (
                        <span
                            key={idx}
                            className="bg-yellow-300 text-black font-semibold px-3 py-1 rounded-full border border-yellow-400 shadow"
                        >
                            {w}
                        </span>
                        ))}
                    </div>
                )}
                {elements && (
                    <div className="w-full overflow-auto" style={{ height: 600, minWidth: 800 }}>
                        <TrieSVG root={elements} />
                    </div>
                )}
            </div>
        </div>
    )
}