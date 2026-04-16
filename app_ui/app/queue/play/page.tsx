"use client"
import React from "react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Play() {
    const router = useRouter()
    const [error, setError] = useState<string|null>(null)
    const [sessionID, setSessionID] = useState<string|null>(null)
    const [options, setOptions] = useState(0)
    const [value, setValue] = useState("")
    const [message, setMessage] = useState<string|null>(null)
    const [elements, setElements] = useState<string[]>([])

    useEffect(() => {
        const createQueue = async () => {
            const storedSession = sessionStorage.getItem("session_id")
            if (storedSession){
                setSessionID(storedSession)
                const storedElements = sessionStorage.getItem("queue_elements")
                if (storedElements){
                    setElements(JSON.parse(storedElements))
                    return 
                }
                await fetch("http://localhost:8000/queue/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_id: storedSession
                    })
                })
                return
            }
            router.push("/")
        }
        createQueue()
    }, [])

    const ChangeOptions = () => {
        setValue("")
        setMessage(null)
    }

    const enqueue = async () => {
        if (value === "") {
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/queue/enqueue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("queue_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const dequeue = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/queue/dequeue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
            sessionStorage.setItem("queue_elements", JSON.stringify(data.elements))
        }else{
            setError(data.detail)
        }
    }

    const getLength = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/queue/length", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
        }else{
            setError("Failed to get length")
        }
    }

    return (
        <div className="border-4 border-yellow-300 p-5 rounded-lg w-[70%]">
            <h2 className="text-2xl text-center">You can select your options here and view how the queue behaves</h2>
            <div className="flex justify-between my-5">
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 0 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(0); ChangeOptions()}}>Enqueue Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 1 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(1); ChangeOptions()}}>Dequeue Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 2 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(2); ChangeOptions(); getLength()}}>Get Length</button>
            </div>
            {options === 0 && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter value to insert</label>
                        <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={enqueue} disabled={value === ""}>Enqueue</button>
                </div>
            </div>
            }
            {options === 1 && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex justify-center mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white" onClick={dequeue}>Dequeue</button>
                </div>
            </div>
            }
            <div className="mt-5">
                {message && <p className={`text-center mb-3 font-semibold ${message === "False" ? "text-red-500" : "text-green-500"}`}>{message}</p>}
                {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
                <div className="flex items-center overflow-x-auto max-w-full py-2">
                    {elements.length > 0 && <span className="text-yellow-300 mr-2">Front</span>}
                    {elements.map((el, idx) => (
                        <React.Fragment key={idx}>
                        <div className="border-2 border-yellow-300 rounded-lg px-4 py-2 mx-1 bg-black text-yellow-300 font-bold min-w-10 text-center">
                            {el}
                        </div>
                        {idx < elements.length - 1 && (
                            <span className="text-2xl text-yellow-300 mx-1">→</span>
                        )}
                        </React.Fragment>
                    ))}
                    {elements.length > 0 && <span className="ml-2 text-yellow-300">Rear</span>}
                </div>
            </div>
        </div>
    )
}