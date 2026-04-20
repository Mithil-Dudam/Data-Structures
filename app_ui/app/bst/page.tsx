"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function BST(){
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
                <li>A <b>Binary Search Tree (BST)</b> is a hierarchical data structure made up of nodes, where each node contains a value, a parent, a left child, and a right child.</li>
                <li>For any node, all values in its left subtree are less than the node’s value, and all values in its right subtree are greater.</li>
                <li>The <b>root</b> is the topmost node of the tree. If the tree is empty, the root is <b>null</b>.</li>
                <li>BST&apos;s allow for efficient searching, insertion, and deletion of elements, with average time complexity of O(log n), if the tree is balanced.</li>
                <li>Traversal methods include <b>in-order</b> (sorted order), <b>pre-order</b>, and <b>post-order</b>.</li>
                <li>BST&apos;s are used in searching, sorting, and maintaining dynamic sets of ordered data.</li>
                <li><i>Analogy:</i> Think of a family tree, where each person can have up to two children, and everyone to the left is &quot;smaller&quot; and to the right is &quot;greater&quot; in value.</li>
            </ul>
            <div className="flex justify-center mt-10 mb-5">
                <button className="border-2 p-2 rounded border-yellow-300 cursor-pointer hover:bg-white hover:text-black font-semibold" onClick={() => router.push("/bst/play")}>View it in Action</button>
            </div>
        </div>
    )
}