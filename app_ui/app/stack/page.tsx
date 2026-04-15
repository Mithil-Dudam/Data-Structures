"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Stack(){
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
                <li>A <b>stack</b> is a linear data structure that follows the <b>LIFO</b> (Last In, First Out) principle.</li>
                <li>Elements can only be added or removed from the <b>top</b> of the stack.</li>
                <li>The two main operations are <b>push</b> (add an element to the top) and <b>pop</b> (remove the top element).</li>
                <li>Stacks are used in function call management, undo features, expression evaluation, and more.</li>
                <li>Time complexity for push and pop operations is O(1).</li>
                <li><i>Analogy:</i> Imagine a stack of plates; you add and remove plates from the top only.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/stack/play")}>View it in Action</button>
            </div>
        </div>
    )
}