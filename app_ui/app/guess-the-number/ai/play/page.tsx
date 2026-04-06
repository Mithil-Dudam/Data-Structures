"use client"
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PlayContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionID = searchParams.get("session_id")

    const [error, setError] = useState<string | null>(null)
    const [screen, setScreen] = useState<number>(0)
    const [startRange, setStartRange] = useState<number>(1)
    const [endRange, setEndRange] = useState<number>(100000000000)
    const [message, setMessage] = useState<string | null>(null)
    const [attempts, setAttempts] = useState<number>(0)
    const [gameOver, setGameOver] = useState<boolean | null>(null)
    const [newStartRange, setNewStartRange] = useState<number | null>(null)
    const [newEndRange, setNewEndRange] = useState<number | null>(null)
    const [mid, setMid] = useState<number | null>(null)

    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/guess-the-number/ai-guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                start: newStartRange !== null ? newStartRange : startRange,
                end: newEndRange !== null ? newEndRange : endRange,
                session_id: sessionID
            })
        })
        const data = await response.json()
        if (response.status === 200) {
            setMessage(data.message)
            setAttempts(data.attempts)
            setGameOver(data.game_over)
            setMid(data.mid)
            setStartRange(data.start)
            setEndRange(data.end)
            setNewStartRange(data.new_start)
            setNewEndRange(data.new_end)
        } else {
            setError(data.detail)
        }
    }

    const reset = async () => {
        const response = await fetch("http://localhost:8000/guess-the-number/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: sessionID
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setError(null)
            setScreen(0)
            setStartRange(1)
            setEndRange(100000000000)
            setMessage(null)
            setAttempts(0)
            setGameOver(null)
            setNewStartRange(null)
            setNewEndRange(null)
            setMid(null)
        }else{
            setError(data.detail)
        }
    }

    useEffect(() => {
        const checkGameStatus = async () => {
            const response = await fetch("http://localhost:8000/guess-the-number/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_id: sessionID
                })
            });
            if (response.status !== 200) {
                router.push("/guess-the-number/ai")
                return
            }else{
                const data = await response.json()
                if(data.status === false){
                    router.push("/guess-the-number/ai")
                    return
                }  
            }
        }
        checkGameStatus()
    }, [])

return (
    <>
        {screen === 0 &&
            <div className="border-4 border-yellow-300 p-5 flex flex-col items-center rounded">
                <h1 className="text-2xl mb-5">The AI is going to come up with a way to guess your number !</h1>
                <p className="text-2xl">Here is a little secret for you, it&apos;s not random !</p>
                <p className="text-2xl">It uses a binary search algorithm to efficiently narrow down the possibilities.</p>
                <p className="text-2xl mt-5">It will keep halving the search space based on whether the guess is too high, too low, or correct.</p>
                <div className="flex my-15">
                    <button className="border-2 cursor-pointer border-yellow-300 p-2 rounded-full hover:text-black hover:bg-white text-lg" onClick={() => { setScreen(1) }}>Watch the AI work</button>
                </div>
            </div>
        }
        {screen === 1 &&
            <div className="p-5 border-4 rounded border-yellow-300">
                <p className="text-2xl">Range of number&apos;s to choose from {startRange} to {endRange}</p>
                <div className="flex justify-between my-10 text-lg">
                    <p className="mx-auto"><span className="border-b-2 border-yellow-300">Start = {startRange}</span></p>
                    <p className="mx-auto"><span className="border-b-2 border-yellow-300">End = {endRange}</span></p>
                </div>
                {gameOver !== null &&
                    <div className="my-5">
                        <p className="text-center text-lg my-1">The AI guessed: <span className="font-bold">{mid}</span></p>
                        <p className="text-center text-lg my-1">Result: <span className={`${message?.includes("high") ? "text-red-500" : message?.includes("low") ? "text-blue-500" : "text-green-500 font-semibold"}`}>{message}</span></p>
                        <p className="text-center text-lg my-1">Attempts: {attempts}</p>
                        {gameOver === false && <p className="my-5 text-center text-lg">From the result, the new range is now from {newStartRange} to {newEndRange}</p>}
                    </div>
                }
                <div className="flex justify-center my-5">
                    {message !== "AI guessed the number!" ? (
                        <button className="p-2 rounded-full border-2 border-yellow-300 cursor-pointer hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50" onClick={handleSubmit} disabled={gameOver === true}>
                            Continue
                        </button>
                        ) : (
                        <div className="w-full flex justify-between">
                            <button className="mx-auto p-2 rounded-full cursor-pointer border-2 border-yellow-300 hover:text-black hover:bg-white" onClick={() => {router.push("/guess-the-number/ai");reset()}}>Play Again ?</button>
                            <button className="mx-auto p-2 rounded-full cursor-pointer border-2 border-yellow-300 hover:text-black hover:bg-white" onClick={() => {router.push("/guess-the-number");reset()}}>Back to Home</button>
                        </div>
                        )
                    }
                </div>
                {error && <p className="text-center text-red-500 my-5">{error}</p>}
            </div>
        }
    </>
    )
}

export default function Play(){
    return(
        <Suspense fallback={<div className="text-center p-10">Loading game...</div>}>
            <PlayContent />
        </Suspense>
    )
}