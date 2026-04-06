import { ReactNode } from "react";

export default function Layout({children}: { children: ReactNode }) {
    return (
    <div className="w-screen h-screen flex flex-col">
      <h1 className="text-center my-5 text-5xl"><span className="border-b-4 border-yellow-300">Guess The Number</span></h1>
      <div className="flex flex-1 justify-center items-center">
        {children}
      </div>
    </div>
  );
}