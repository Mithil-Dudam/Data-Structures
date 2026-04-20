"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const createSession = async () => {
      const response = await fetch("http://localhost:8000/create-session", {
        method: "GET",
      })
      const data = await response.json()
      if (response.status === 201){
        sessionStorage.setItem("session_id", data.session_id)
      }
    }
    createSession()
  }, [])
  return (
    <div className="w-screen h-screen flex flex-col">
      <h1 className="text-center text-5xl font-bold pt-10"><span className="border-b-4 border-yellow-300">Data Structures Visualizer</span></h1>
      <div className="my-auto flex justify-center">
        <ul className="flex flex-col items-center">
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/sll")}>Singly Linked List</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/dll")}>Doubly Linked List</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/stack")}>Stack</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/queue")}>Queue</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/bst")}>Binary Search Tree</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/heap")}>Heap</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/trie")}>Trie</button></li>
          <li><button className="border-2 cursor-pointer my-2 p-2 text-2xl border-yellow-300 hover:font-semibold hover:text-black hover:bg-white" onClick={() => router.push("/graph")}>Graph</button></li>
        </ul>
      </div>
    </div>
  );
}
