"use client"
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Play(){
    const router = useRouter()

    const [error, setError] = useState<string|null>(null)
    const searchParams = useSearchParams()
    const startRange = Number(searchParams.get("start"))
    const endRange = Number(searchParams.get("end"))
    const [guess, setGuess] = useState<number|null>(null)
    const [message, setMessage] = useState<string|null>(null)
    const [attempts, setAttempts] = useState<number>(0)
    const [gameOver, setGameOver] = useState<boolean>(false)

    useEffect(() => {
        const checkGameStatus = async () => {
            const response = await fetch("http://localhost:8000/guess-the-number/status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
            });
            const data = await response.json()
            const status = data.status 
            if (
                status === false ||
                isNaN(startRange) ||
                isNaN(endRange) ||
                startRange >= endRange
                ) {
                router.push("/guess-the-number/user")
            }
        }
        checkGameStatus()
    }, [])

    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/guess-the-number/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                guess: guess
            })
        })
        const data = await response.json()
        if (response.status === 200){
            setMessage(data.message)
            setAttempts(data.attempts)
            setGameOver(data.game_over)
        }else{
            setError("An error occurred while making the guess. Please try again.")
        }
    }

    const reset = async () => {
        await fetch("http://localhost:8000/guess-the-number/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        setError(null)
        setGuess(null)
        setAttempts(0)
        setGameOver(false)
        setMessage(null)
    }

    return(
        <div className="border-4 rounded border-yellow-300 p-5 ">
            <h1 className="text-2xl text-center">A number has been picked between {startRange} and {endRange} !</h1>
            <div className="my-10 flex justify-between items-center">
                <label className="mx-auto">Enter Guess</label>
                <input type="number" value={guess === null ? "" : guess} onChange={e => {const val = e.target.value;setGuess(val === "" ? null : Number(val))}}  className="bg-white pl-2 mx-auto text-black disabled:cursor-not-allowed" disabled={gameOver === true}></input>
            </div>
            {message !== "Congratulations! You've guessed the number!" &&  
            <div className="flex justify-center">
                <button type="submit" className="p-2 border-2 border-yellow-300 rounded-full cursor-pointer hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50" disabled={guess === null || gameOver === true} onClick={() => {setMessage(null);handleSubmit()}}>Guess</button>
            </div>
            }
            {message &&
                <p className={`text-center my-5 ${message.includes("high") ? "text-red-500" : message.includes("low") ? "text-blue-500" : "text-green-500 font-semibold"}`}>{message}</p>
            }
            {attempts !== 0 &&
                <p className="text-center my-5">Total attempts: {attempts}</p>
            }
            {error &&
                <p className="text-center my-5 text-red-500">{error}</p>
            }
            {gameOver === true &&
                <div className="flex justify-between">
                    <button className="mx-auto p-2 rounded-full cursor-pointer border-2 border-yellow-300 hover:text-black hover:bg-white" onClick={() => {router.push("/guess-the-number/user");reset()}}>Play Again ?</button>
                    <button className="mx-auto p-2 rounded-full cursor-pointer border-2 border-yellow-300 hover:text-black hover:bg-white" onClick={() => {router.push("/guess-the-number");reset()}}>Back to Home</button>
                </div>
            }
        </div>
    )
}