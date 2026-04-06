"use client"
import {useRouter} from "next/navigation";
import { useState } from "react";

export default function User(){
    const router = useRouter()

    const [error, setError] = useState<string|null>(null)
    const [startRange, setStartRange] = useState<number|null>(null)
    const [endRange, setEndRange] = useState<number|null>(null)

    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/guess-the-number/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                start: startRange,
                end: endRange
            })
        })
        const data = await response.json()
        if (response.status === 200){
            router.push(`/guess-the-number/user/play?start=${startRange}&end=${endRange}`)
        }else{
            setError(data.detail)
        }
    }

    return(
        <div className="mx-5 border-yellow-300 border-4 rounded p-5">
            <h1 className="text-center text-xl">Great ! But before we begin, let&apos;s set the range for the number</h1>
            <div className="my-10 flex justify-between items-center">
                <label className="mx-auto">Enter start range</label>
                <input type="number" value={startRange === null ? "": startRange} onChange={e => {const val = e.target.value;setStartRange(val === "" ? null: Number(val)); setError(null)}} className="bg-white mx-auto text-black pl-2 " min={1} max={100000000000}></input>
            </div>
            <div className="my-10 flex justify-between items-center">
                <label className="mx-auto">Enter end range</label>
                <input type="number" value={endRange === null ? "": endRange} onChange={e => {const val = e.target.value;setEndRange(val === "" ? null: Number(val)); setError(null)}} className="bg-white mx-auto text-black pl-2 " min={1} max={100000000000}></input>
            </div>
            <div className="flex">
                <button type="submit" className="text-center mx-auto border-2 rounded-full hover:bg-white hover:text-black p-2 cursor-pointer border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={startRange === null || endRange === null}>Confirm</button>
            </div>
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}
        </div>
    )
}