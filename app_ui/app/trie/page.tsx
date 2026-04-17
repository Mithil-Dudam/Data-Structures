"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Trie(){
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
                <li>A <b>trie</b> is a tree-like data structure used for storing a dynamic set of strings, where the keys are usually strings.</li>
                <li>Each node in the trie represents a character of a string, and the path from the root to a node forms a string.</li>
                <li>The main operations are <b>insert</b> (add a string to the trie) and <b>search</b> (check if a string exists in the trie).</li>
                <li>Tries are used in autocomplete, spell checkers, and IP routing.</li>
                <li>Time complexity for insert and search operations is O(m), where m is the length of the string.</li>
                <li><i>Analogy:</i> Imagine a dictionary where each page you turn narrows down the possible words, letter by letter.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/trie/play")}>View it in Action</button>
            </div>
        </div>
    )
}