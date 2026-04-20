"use client"
import React from "react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


type GraphElements = {
    nodes: string[];
    edges: [string, string][];
};

// Simple circular layout for nodes
const GraphSVG: React.FC<{ elements: GraphElements | null }> = ({ elements }) => {
    if (!elements || elements.nodes.length === 0) return <div className="text-center">No graph to display</div>;
    const { nodes, edges } = elements;
    const RADIUS = 160;
    const NODE_RADIUS = 24;
    const centerX = 200;
    const centerY = 200;
    const angleStep = (2 * Math.PI) / nodes.length;
    // Map node to position
    const nodePos: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, i) => {
        const angle = i * angleStep;
        nodePos[node] = {
            x: centerX + RADIUS * Math.cos(angle),
            y: centerY + RADIUS * Math.sin(angle),
        };
    });
    return (
        <svg width={400} height={400} style={{ background: '#18181b', borderRadius: 12 }}>
            {/* Edges */}
            {edges.map(([from, to], i) => (
                <line
                    key={from + '-' + to + '-' + i}
                    x1={nodePos[from]?.x}
                    y1={nodePos[from]?.y}
                    x2={nodePos[to]?.x}
                    y2={nodePos[to]?.y}
                    stroke="#facc15"
                    strokeWidth={3}
                />
            ))}
            {/* Nodes */}
            {nodes.map((node, i) => (
                <g key={node}>
                    <circle
                        cx={nodePos[node].x}
                        cy={nodePos[node].y}
                        r={NODE_RADIUS}
                        fill="#000"
                        stroke="#facc15"
                        strokeWidth={4}
                    />
                    <text
                        x={nodePos[node].x}
                        y={nodePos[node].y + 7}
                        textAnchor="middle"
                        fill="#facc15"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {node}
                    </text>
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
    const [node1, setNode1] = useState<string|null>(null)
    const [node2, setNode2] = useState<string|null>(null)
    const [message, setMessage] = useState<string|null>(null)
    const [elements, setElements] = useState<GraphElements | null>(null)
    const [nodes, setNodes] = useState<string[]>([])
    const [edges, setEdges] = useState<[string, string][]>([])

    useEffect(() => {
        const createGraph = async () => {
            const storedSession = sessionStorage.getItem("session_id")
            if (storedSession){
                setSessionID(storedSession)
                const storedElements = sessionStorage.getItem("graph_elements")
                if (storedElements){
                    setElements(JSON.parse(storedElements))
                    return 
                }
                await fetch("http://localhost:8000/graph/create", {
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
        createGraph()
    }, [])

    const ChangeOptions = () => {
        setNode1(null)
        setNode2(null)
        setMessage(null)
        setNodes([])
        setEdges([])
        setError(null)
    }

    const addNode = async () => {
            if (node1 === null) {
                setError("Node cannot be null")
                return
            }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/add/node", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("graph_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const removeNode = async () => {
        if (node1 === null) {
            setError("Node cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/remove/node", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("graph_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const addEdge = async () => {
        if (node1 === null) {
            setError("Node 1 cannot be null")
            return
        }
        if (node2 === null) {
            setError("Node 2 cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/add/edge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node1: node1,
                node2: node2
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setNode2(null)
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("graph_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const removeEdge = async () => {
        if (node1 === null) {
            setError("Node 1 cannot be null")
            return
        }
        if (node2 === null) {
            setError("Node 2 cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/remove/edge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node1: node1,
                node2: node2
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setNode2(null)
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("graph_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const getNeighbours = async () => {
        if (node1 === null) {
            setError("Node cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/neighbours", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setNodes(data.nodes)
        }else{
            setError(data.detail)
        }
    }

    const hasNode = async () => {
        if (node1 === null) {
            setError("Node cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/has/node", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setMessage(data.message)
        }else{
            setError(data.detail)
        }
    }

    const hasEdge = async () => {
        if (node1 === null) {
            setError("Node 1 cannot be null")
            return
        }
        if (node2 === null) {
            setError("Node 2 cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/has/edge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node1: node1,
                node2: node2
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNode1(null)
            setNode2(null)
            setMessage(data.message)
        }else{
            setError(data.detail)
        }
    }

    const getNodes = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/nodes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNodes(data.nodes)
        }else{
            setError("Error fetching nodes")
        }
    }

    const getEdges = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/edges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setEdges(data.edges)
        }else{
            setError("Error fetching edges")
        }
    }

    const bfs = async () => {
        if (node1 === null) {
            setError("Node 1 cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/bfs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNodes(data.nodes)
        }else{
            setError(data.detail)
        }
    }

    const dfs = async () => {
        if (node1 === null) {
            setError("Node 1 cannot be null")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/graph/dfs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                node: node1
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setNodes(data.nodes)
        }else{
            setError(data.detail)
        }
    }

    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg w-[70%]">
            <h2 className="text-2xl text-center">You can select your options here and view how the graph behaves</h2>
            <div className="flex justify-between my-5">
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 0 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(0); ChangeOptions()}}>Add Node</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 1 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(1); ChangeOptions()}}>Remove Node</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 2 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(2); ChangeOptions()}}>Add Edge</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 3 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(3); ChangeOptions()}}>Remove Edge</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 4 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(4); ChangeOptions()}}>Get Neighbors</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 5 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(5); ChangeOptions()}}>Search Node</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 6 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(6); ChangeOptions()}}>Search Edge</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 7 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(7); ChangeOptions(); getNodes()}}>All Nodes</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 8 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(8); ChangeOptions(); getEdges()}}>All Edges</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 9 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(9); ChangeOptions()}}>BFS</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 10 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(10); ChangeOptions()}}>DFS</button>
            </div>
            {(options === 0 || options === 1 || options === 4 || options === 5 || options === 9 || options === 10) && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter Node</label>
                        <input
                        type="text"
                        value={node1 === null ? "" : node1}
                        onChange={(e) => setNode1(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={options === 0 ? addNode : options === 1 ? removeNode : options === 4 ? getNeighbours : options === 5 ? hasNode : options === 9 ? bfs : dfs} disabled={node1 === null}>{options === 0 ? "Add" : options === 1 ? "Remove" : options === 4 ? "Fetch" : options === 5 ? "Search" : "Traverse"}</button>
                </div>
            </div>
            }
            {(options === 2 || options === 3 || options === 6) && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md mb-4">
                        <label className="w-48 text-right mr-4">Enter Node 1</label>
                        <input
                        type="text"
                        value={node1 === null ? "" : node1}
                        onChange={(e) => setNode1(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter Node 2</label>
                        <input
                        type="text"
                        value={node2 === null ? "" : node2}
                        onChange={(e) => setNode2(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={options === 2 ? addEdge : options === 3 ? removeEdge : hasEdge} disabled={node1 === null || node2 === null}>{options === 2 ? "Add" : options === 3 ? "Remove" : "Search"}</button>
                </div>
            </div>
            }
            <div className="mt-5">
                {message && <p className={`text-center mb-3 font-semibold ${message === "False" ? "text-red-500" : "text-green-500"}`}>{message}</p>}
                {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
                {nodes && nodes.length > 0 && <p className="text-center mb-3 font-semibold text-yellow-500">{nodes.join(", ")}</p>}
                {edges && edges.length > 0 && <p className="text-center mb-3 font-semibold text-yellow-500">{edges.join(" | ")}</p>}
                <div className="flex justify-center overflow-auto py-2">
                    <GraphSVG elements={elements} />
                </div>
            </div>
        </div>
    )
}