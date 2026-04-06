import Link from "next/link";

export default function Home(){
  return (
    <div className="p-5 mx-10 border-yellow-300 border-4 rounded">
      <h2 className="text-center font-medium text-3xl">Hey there!</h2>
      <p className="text-2xl text-center">Welcome to <span className="font-bold">Guess The Number!</span></p>
      <p className="text-xl my-10">You can choose to guess the number or have an AI guess your number !</p>
      <div className="flex justify-between">
        <Link href="/guess-the-number/user" className="mx-auto">
          <button className="border-yellow-300 border-2 p-2 rounded-full cursor-pointer hover:bg-white hover:text-black">You Guess</button>
        </Link>
        <Link href="/guess-the-number/ai" className="mx-auto">
          <button className="border-yellow-300 border-2 mx-auto p-2 rounded-full cursor-pointer hover:bg-white hover:text-black">Let AI Guess</button>
        </Link>
      </div>
    </div>
  )
}