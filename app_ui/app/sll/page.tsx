"use client"
import { useRouter } from "next/navigation";

export default function SLL(){
    const router = useRouter()
    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg text-lg">
            <h2 className="text-center text-3xl mt-5 mb-10 font-semibold"><span className="border-b-2 border-yellow-300">A Quick Description</span></h2>
            <ul className="list-disc pl-5 marker:text-yellow-300">
                <li>A singly linked list is a linear data structure made up of nodes, where each node contains data and a reference to the next node in the sequence.</li>
                <li>The list starts with a special reference called the <b>head</b>. If the list is empty, the head is <b>null</b>.</li>
                <li>Each node points to the next node, and the last node points to <b>null</b>, marking the end of the list.</li>
                <li>Singly linked lists can grow or shrink at runtime, making them dynamic and memory-efficient for certain operations.</li>
                <li>They are commonly used to implement stacks, queues, and other abstract data types.</li>
                <li>Insertion and deletion operations generally require traversing the list, resulting in O(n) time complexity.</li>
                <li><i>Analogy:</i> Imagine a chain where each link points to the next; you can only move forward, not backward.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/sll/play")}>View it in Action</button>
            </div>
        </div>
    )
}