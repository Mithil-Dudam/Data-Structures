"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Queue(){
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
                <li>A <b>queue</b> is a linear data structure that follows the <b>FIFO</b> (First In, First Out) principle.</li>
                <li>Elements are added at the <b>rear</b> (end) and removed from the <b>front</b> (beginning) of the queue.</li>
                <li>The two main operations are <b>enqueue</b> (add an element to the rear) and <b>dequeue</b> (remove the front element).</li>
                <li>Queues are used in scheduling, buffering, breadth-first search, and more.</li>
                <li>Time complexity for enqueue and dequeue operations is O(1).</li>
                <li><i>Analogy:</i> Imagine a line of people waiting for a bus; the first person in line is the first to board.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/queue/play")}>View it in Action</button>
            </div>
        </div>
    )
}