"use client"
import React from "react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type BSTNode = {
  value: number;
  parent: number | null;
  left: BSTNode | null;
  right: BSTNode | null;
};

type PositionedNode = BSTNode & {
  x: number;
  y: number;
};

function getPositions(
  node: BSTNode | null,
  depth = 0,
  x = 0,
  positions: PositionedNode[] = [],
  xOffset = { value: 0 }
): PositionedNode[] {
  if (!node) return positions;
  // In-order traversal for horizontal spacing
  getPositions(node.left, depth + 1, x, positions, xOffset);
  positions.push({ ...node, x: xOffset.value * 60, y: depth * 90 });
  xOffset.value += 1;
  getPositions(node.right, depth + 1, x, positions, xOffset);
  return positions;
}

const BSTSVGTree: React.FC<{ node: BSTNode | null }> = ({ node }) => {
  if (!node) return null;
  const positions: PositionedNode[] = [];
  getPositions(node, 0, 0, positions);

  // Map value to position for quick lookup
  const posMap = new Map<number, PositionedNode>();
  positions.forEach((n) => posMap.set(n.value, n));

  // Helper to draw lines
  const lines = positions.flatMap((n) => {
    const linesArr = [];
    if (n.left) {
      const left = posMap.get(n.left.value);
      if (left)
        linesArr.push(
          <line
            key={`${n.value}-${left.value}`}
            x1={n.x + 25}
            y1={n.y + 25}
            x2={left.x + 25}
            y2={left.y + 25}
            stroke="#facc15"
            strokeWidth={2}
          />
        );
    }
    if (n.right) {
      const right = posMap.get(n.right.value);
      if (right)
        linesArr.push(
          <line
            key={`${n.value}-${right.value}`}
            x1={n.x + 25}
            y1={n.y + 25}
            x2={right.x + 25}
            y2={right.y + 25}
            stroke="#facc15"
            strokeWidth={2}
          />
        );
    }
    return linesArr;
  });

  return (
    <div className="relative w-full flex justify-center">
      <svg
        width={Math.max(...positions.map((n) => n.x)) + 100}
        height={Math.max(...positions.map((n) => n.y)) + 120}
        style={{ overflow: "visible" }}
      >
        {lines}
        {positions.map((n) => (
          <g key={n.value}>
            <circle
              cx={n.x + 25}
              cy={n.y + 25}
              r={25}
              fill="#000"
              stroke="#facc15"
              strokeWidth={3}
            />
            <text
              x={n.x + 25}
              y={n.y + 32}
              textAnchor="middle"
              fill="#facc15"
              fontSize="20"
              fontWeight="bold"
            >
              {n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function Play() {
    const router = useRouter()
    const [error, setError] = useState<string|null>(null)
    const [sessionID, setSessionID] = useState<string|null>(null)
    const [options, setOptions] = useState(0)
    const [value, setValue] = useState<number|null>(null)
    const [message, setMessage] = useState<string|null>(null)
    const [elements, setElements] = useState<BSTNode | null>(null)

    useEffect(() => {
        const createBST = async () => {
            const storedSession = sessionStorage.getItem("session_id")
            if (storedSession){
                setSessionID(storedSession)
                const storedElements = sessionStorage.getItem("bst_elements")
                if (storedElements){
                    setElements(JSON.parse(storedElements))
                    return 
                }
                await fetch("http://localhost:8000/bst/create", {
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
        createBST()
    }, [])

    const ChangeOptions = () => {
        setValue(null)
        setMessage(null)
    }

    const insert = async () => {
        if (value === null) {
            setError("Value cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/bst/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value: value
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setValue(null)
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("bst_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const deleteElement = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/bst/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("bst_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const searchElement = async () => {
        if (value === null) {
            setError("Value cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/bst/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
        }else{
            setError(data.detail)
        }
    }

    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg w-[70%]">
            <h2 className="text-2xl text-center">You can select your options here and view how the binary search tree behaves</h2>
            <div className="flex justify-between my-5">
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 0 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(0); ChangeOptions()}}>Insert Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 1 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(1); ChangeOptions()}}>Delete Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 2 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(2); ChangeOptions()}}>Search Element</button>
            </div>
            {options === 0 && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter value to insert</label>
                        <input
                        type="number"
                        value={value === null ? "" : value}
                        onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={insert} disabled={value === null}>Insert</button>
                </div>
            </div>
            }
            {(options === 1 || options === 2) && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">{options === 1 ? "Enter value to delete" : "Enter value to search"}</label>
                        <input type="number" value={value === null ? "" : value} onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))} className="bg-white flex-1 text-black pl-2"></input>
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={options === 1 ? deleteElement : searchElement}disabled={value === null}>{options === 1 ? "Delete":"Search"}</button>
                </div>
            </div>
            }
            <div className="mt-5">
                {message && <p className={`text-center mb-3 font-semibold ${message === "False" ? "text-red-500" : "text-green-500"}`}>{message}</p>}
                {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
                <div className="flex justify-center overflow-auto py-2">
                    <BSTSVGTree node={elements} />
                </div>
            </div>
        </div>
    )
}