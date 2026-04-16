"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function Heap(){
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
                <li>A heap is a complete binary tree that satisfies the heap property.</li>
                <li>There are two types of heaps: max-heap and min-heap.</li>
                <li>In a max-heap, the parent node is always greater than or equal to its child nodes.</li>
                <li>In a min-heap, the parent node is always less than or equal to its child nodes.</li>
                <li>Heaps are commonly used to implement priority queues.</li>
                <li>Insertion and deletion operations in a heap have a time complexity of O(log n).</li>
                <li><i>Analogy:</i> Think of a heap as a pile of books where the heaviest book is always at the top (Max-Heap) or the lightest book is always at the top (Min-Heap).</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/heap/play")}>View it in Action</button>
            </div>
        </div>
    )
}