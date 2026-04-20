import { ReactNode } from "react";

export default function Layout({children}: { children: ReactNode }) {
    return (
    <div className="w-screen h-screen flex flex-col">
      <h1 className="text-center mt-10 text-5xl"><span className="border-b-4 border-yellow-300 font-bold">Graph</span></h1>
      <div className="flex flex-1 justify-center items-center">
        {children}
      </div>
    </div>
  );
}