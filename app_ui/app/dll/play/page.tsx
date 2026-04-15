"use client"
import { useEffect, useState } from "react"

export default function Play() {
    const [error, setError] = useState<string|null>(null)
    const [sessionID, setSessionID] = useState<string|null>(null)
    const [options, setOptions] = useState(-1)
    const [value, setValue] = useState("")
    const [index, setIndex] = useState<number|null>(null)
    const [delIndex, setDelIndex] = useState<number>(-1)
    const [message, setMessage] = useState<string|null>(null)
    const [elements, setElements] = useState<string[]>([])

    useEffect(() => {
        const createDLL = async () => {
            const response = await fetch("http://localhost:8000/dll/create", {
                method: "POST",
            })
            const data = await response.json()
            if (response.status === 201){
                setSessionID(data.session_id)
            }else{
                setError("Failed to create session")
            }
        }
        createDLL()
    }, [])

    const ChangeOptions = () => {
        setValue("")
        setIndex(null)
        setDelIndex(-1)
        setMessage(null)
    }

    const insert = async () => {
        if (value === "") {
            setError("Value cannot be empty")
            return
        }
        if (index !== null && index < 0) {
            setError("Index cannot be negative")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/dll/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value,
                index: index
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
        }else{
            setError(data.detail)
        }
    }

    const deleteElement = async () => {
        if (value === "") {
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/dll/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
        }else{
            setError(data.detail)
        }
    }

    const deleteIndex = async () => {
        if (delIndex < 0) {
            setError("Index cannot be negative")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/dll/delete-index", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                index: delIndex
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setElements(data.elements)
        }else{
            setError(data.detail)
        }
    }

    const searchElement = async () => {
        if (value === ""){
            setError("Value cannot be empty")
            return
        }
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/dll/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID,
                value:value
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
        }else{
            setError(data.detail)
        }
    }

    const getLength = async () => {
        setError(null)
        setMessage(null)
        const response = await fetch("http://localhost:8000/dll/length", {
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
            <h2 className="text-2xl text-center">You can select your options here and view how the list behaves</h2>
            <div className="flex justify-between my-5">
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 0 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(0); ChangeOptions()}}>Insert Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 1 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(1); ChangeOptions()}}>Delete Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 2 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(2); ChangeOptions()}}>Delete Index</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 3 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(3); ChangeOptions()}}>Search Element</button>
                <button className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${options === 4 ? 'bg-green-900':"hover:text-black hover:bg-white"}`} onClick={() => {setOptions(4); ChangeOptions(); getLength()}}>Get Length</button>
            </div>
            {options === 0 && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center mb-4 w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter value to insert</label>
                        <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="bg-white text-black pl-2 flex-1"
                        />
                    </div>
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">Enter index to insert into</label>
                        <input
                        type="number"
                        value={index === null ? "" : index}
                        onChange={(e) => setIndex(e.target.value === "" ? null : Number(e.target.value))}
                        className="bg-white text-black pl-2 flex-1"
                        placeholder="Optional"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={insert} disabled={value === ""}>Insert</button>
                </div>
            </div>
            }
            {(options === 1 || options === 2 || options === 3) && 
            <div className="border-t-2 border-b-2 pt-5">
                <div className="flex flex-col items-center my-5">
                    <div className="flex flex-row items-center w-full max-w-md">
                        <label className="w-48 text-right mr-4">{options === 1 ? "Enter value to delete" : options === 2 ? "Enter index to delete" : "Enter value to search"}</label>
                        <input type="text" value={(options === 1 || options === 3) ? value : delIndex === -1 ? "" : delIndex } onChange={(e) => {if(options===1 || options===3){setValue(e.target.value)}else{setDelIndex(e.target.value === "" ? -1 :Number(e.target.value))}}} className="bg-white flex-1 text-black pl-2"></input>
                    </div>
                </div>
                <div className="flex justify-center mt-10 mb-5">
                    <button className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" onClick={options === 1 ? deleteElement : options === 2 ? deleteIndex : searchElement}disabled={(options === 1 || options === 3) ? value === "" : (delIndex === null || delIndex < 0)}>{(options === 1 || options === 2) ? "Delete":"Search"}</button>
                </div>
            </div>
            }
            <div className="mt-5">
                {message && <p className={`text-center mb-3 font-semibold ${message === "False" ? "text-red-500" : "text-green-500"}`}>{message}</p>}
                <div className="text-center mx-auto mt-2 mb-2 bg-black text-white max-h-[4.5em] overflow-y-auto whitespace-pre-line">
                    {elements.length > 0 && elements.join(" <-> ")}
                </div>
                {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
            </div>
        </div>
    )
}