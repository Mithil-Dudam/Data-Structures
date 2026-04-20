"use client"

import { useEffect } from "react"

export default function Home() {
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
    <div>
      <h1 className="text-center">Hello!</h1>
      <p><a href="/sll">Click for SLL</a></p>
      <p><a href="/dll">Click for DLL</a></p>
      <p><a href="/stack">Click for Stack</a></p>
      <p><a href="/queue">Click for Queue</a></p>
      <p><a href="/bst">Click for Binary Search Tree</a></p>
      <p><a href="/heap">Click for Heap</a></p>
      <p><a href="/trie">Click for Trie</a></p>
      <p><a href="/graph">Click for Graph</a></p>
    </div>
  );
}
