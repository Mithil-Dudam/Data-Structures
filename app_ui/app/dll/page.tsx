"use client"
import { useRouter } from "next/navigation";

export default function DLL(){
    const router = useRouter()
    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg text-lg">
            <h2 className="text-center text-3xl mt-5 mb-10 font-semibold"><span className="border-b-2 border-yellow-300">A Quick Description</span></h2>
            <ul className="list-disc pl-5 marker:text-yellow-300">
                <li>A doubly linked list is a linear data structure made up of nodes, where each node contains data, a reference to the next node, and a reference to the previous node.</li>
                <li>The list starts with a special reference called the <b>head</b>. If the list is empty, the head is <b>null</b>.</li>
                <li>The first node&apos;s previous reference and the last node&apos;s next reference are both <b>null</b>, marking the boundaries of the list.</li>
                <li>Nodes can be traversed in both directions—forward and backward—thanks to the two references in each node.</li>
                <li>Doubly linked lists are dynamic, allowing them to grow or shrink at runtime by allocating or deallocating nodes as needed.</li>
                <li>They are useful for implementing data structures like stacks, queues, and navigation systems where bidirectional traversal is needed.</li>
                <li>Insertion and deletion operations generally require traversing the list, resulting in O(n) time complexity.</li>
                <li><i>Analogy:</i> Think of a train where each carriage is connected to both the one in front and the one behind, allowing movement in either direction.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/dll/play")}>View it in Action</button>
            </div>
        </div>
    )
}