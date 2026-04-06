"use client"
import {useRouter} from "next/navigation";
import { useState } from "react";

export default function AI(){
    const router = useRouter()

    const [error, setError] = useState<string|null>(null)
    const [number, setNumber] = useState<number|null>(null)

    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/guess-the-number/number", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                number: number,
            })
        })
        const data = await response.json()
        if (response.status === 200){
            router.push(`/guess-the-number/ai/play?session_id=${data.session_id}`)
        }else{
            setError(data.detail)
        }
    }

    return(
        <div className="mx-5 border-yellow-300 border-4 rounded p-5">
            <h1 className="text-center text-xl">Great ! But before we begin, choose a number in the range 1 to 100000000000</h1>
            <div className="my-10 flex justify-between items-center">
                <label className="mx-auto">Enter your number</label>
                <input type="number" value={number === null ? "": number} onChange={e => {const val = e.target.value;setNumber(val === "" ? null: Number(val)); setError(null)}} className="bg-white mx-auto text-black pl-2 " min={1} max={100000000000}></input>
            </div>
            <div className="flex">
                <button type="submit" className="text-center mx-auto border-2 rounded-full hover:bg-white hover:text-black p-2 cursor-pointer border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit} disabled={number === null}>Confirm</button>
            </div>
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}
        </div>
    )
}