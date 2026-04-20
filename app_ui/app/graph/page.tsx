"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function Graph(){
    const router = useRouter()
    useEffect(() => {
        const storedSession = sessionStorage.getItem("session_id")
        if (! storedSession){
            router.push("/")
        }
    }, [])
    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg text-lg">
            <h2 className="text-center text-3xl mt-5 mb-10 font-semibold"><span className="border-b-2 border-yellow-300">A Quick Description</span></h2>
            <ul className="list-disc pl-5 marker:text-yellow-300">
                <li>A <b>Graph</b> is a collection of nodes (vertices) connected by edges.</li>
                <li>Graphs can be <b>directed</b> (edges have a direction) or <b>undirected</b> (edges have no direction).</li>
                <li>They are used to model relationships between objects, such as social networks, transportation systems, and computer networks.</li>
                <li>Common operations on graphs include traversal (BFS and DFS), finding shortest paths, and detecting cycles.</li>
                <li>Graphs can be represented using an <b>adjacency matrix</b> or an <b>adjacency list</b>.</li>
                <li>Time Complexity: O(V + E) for BFS and DFS, where V is the number of vertices and E is the number of edges.</li>
                <li><i>Analogy:</i> Think of a map with cities (nodes) connected by roads (edges).</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/graph/play")}>View it in Action</button>
            </div>
        </div>
    )
}