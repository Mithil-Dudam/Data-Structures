"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type HeapTreeProps = {
  elements: number[] | null;
  title: string;
};

const HeapSVGTree: React.FC<HeapTreeProps> = ({ elements, title }) => {
  if (!elements || elements.length === 0) return null;

  // Calculate positions for each node
  const getNodePosition = (index: number, xOffset = 0, width = 400): { x: number, y: number } => {
    const level = Math.floor(Math.log2(index + 1));
    const nodesInLevel = 2 ** level;
    const posInLevel = index - (nodesInLevel - 1);
    const x = width / (nodesInLevel + 1) * (posInLevel + 1) + xOffset;
    const y = level * 90;
    return { x, y };
  };

  const nodes = elements.map((value, idx) => {
    const { x, y } = getNodePosition(idx);
    return { value, x, y, idx };
  });

  // Draw lines between parent and child
  const lines = nodes.flatMap((node) => {
    const leftIdx = 2 * node.idx + 1;
    const rightIdx = 2 * node.idx + 2;
    const arr: React.ReactElement[] = [];
    if (leftIdx < nodes.length) {
      arr.push(
        <line
          key={`${node.idx}-l`}
          x1={node.x + 25}
          y1={node.y + 25}
          x2={nodes[leftIdx].x + 25}
          y2={nodes[leftIdx].y + 25}
          stroke="#facc15"
          strokeWidth={2}
        />
      );
    }
    if (rightIdx < nodes.length) {
      arr.push(
        <line
          key={`${node.idx}-r`}
          x1={node.x + 25}
          y1={node.y + 25}
          x2={nodes[rightIdx].x + 25}
          y2={nodes[rightIdx].y + 25}
          stroke="#facc15"
          strokeWidth={2}
        />
      );
    }
    return arr;
  });

  return (
    <div className="flex flex-col items-center mx-4">
      <div className="mb-2 text-lg font-bold text-yellow-300">{title}</div>
      <svg
        width={450}
        height={Math.max(...nodes.map((n) => n.y)) + 100}
        style={{ overflow: "visible" }}
      >
        {lines}
        {nodes.map((n) => (
          <g key={n.idx}>
            <circle
              cx={n.x + 25}
              cy={n.y + 25}
              r={25}
              fill="#000"
              stroke="#facc15"
              strokeWidth={3}
            />
            <text
              x={n.x + 25}
              y={n.y + 32}
              textAnchor="middle"
              fill="#facc15"
              fontSize="20"
              fontWeight="bold"
            >
              {n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function Play() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [options, setOptions] = useState(0);
  const [value, setValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [maxHeapElements, setMaxHeapElements] = useState<number[] | null>(null);
  const [minHeapElements, setMinHeapElements] = useState<number[] | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const [minValue, setMinValue] = useState<number | null>(null);
  const [heapifyElements, setHeapifyElements] = useState<string | null>(null);
  const [maxHeapifyElements, setMaxHeapifyElements] = useState<number[] | null>(null);
  const [minHeapifyElements, setMinHeapifyElements] = useState<number[] | null>(null);
  const [heapTab, setHeapTab] = useState<"max" | "min">("max");

  useEffect(() => {
    const createHeap = async () => {
      const storedSession = sessionStorage.getItem("session_id");
      if (storedSession) {
        setSessionID(storedSession);
        const storedMaxElements = sessionStorage.getItem("max_heap_elements");
        const storedMinElements = sessionStorage.getItem("min_heap_elements");
        if (storedMaxElements && storedMinElements) {
          setMaxHeapElements(JSON.parse(storedMaxElements));
          setMinHeapElements(JSON.parse(storedMinElements));
          return;
        }
        await fetch("http://localhost:8000/heap/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: storedSession,
          }),
        });
        return;
      }
      router.push("/");
    };
    createHeap();
  }, []);

  const ChangeOptions = () => {
    setValue(null);
    setMessage(null);
  };

  const insert = async () => {
    if (value === null) {
      setError("Value cannot be null");
      return;
    }
    setError(null);
    setMessage(null);
    const response = await fetch("http://localhost:8000/heap/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionID,
        value: value,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      setValue(null);
      setMessage(data.message);
      setMaxHeapElements(data.max_heap);
      setMinHeapElements(data.min_heap);
      sessionStorage.setItem("max_heap_elements", JSON.stringify(data.max_heap));
      sessionStorage.setItem("min_heap_elements", JSON.stringify(data.min_heap));
    } else {
      setError(data.detail);
    }
  };

  const extract = async () => {
    setError(null);
    setMessage(null);
    const response = await fetch("http://localhost:8000/heap/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionID,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      setMessage(data.message);
      setMaxValue(data.max_element);
      setMinValue(data.min_element);
      setMaxHeapElements(data.max_heap);
      setMinHeapElements(data.min_heap);
      sessionStorage.setItem("max_heap_elements", JSON.stringify(data.max_heap));
      sessionStorage.setItem("min_heap_elements", JSON.stringify(data.min_heap));
    } else {
      setError(data.detail);
    }
  };

  const heapify = async () => {
    if (heapifyElements === null) {
      setError("Enter at least 2 elements to heapify");
      return;
    }
    const elementsArray = heapifyElements
      .split(",")
      .map((el) => el.trim())
      .filter((el) => el !== "")
      .map(Number);
    if (elementsArray.length < 2) {
      setError("Enter at least 2 elements to heapify");
      return;
    }
    setError(null);
    const response = await fetch("http://localhost:8000/heap/heapify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionID,
        elements: elementsArray,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      setMaxHeapifyElements(data.max_heap);
      setMinHeapifyElements(data.min_heap);
      return;
    }
    setError("Failed to heapify the elements");
  };

  return (
    <div className="border-4 border-yellow-300 p-5 rounded-lg w-[70%]">
      <h2 className="text-2xl text-center">You can select your options here and view how the heap behaves</h2>
      <div className="flex justify-between my-5">
        <button
          className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${
            options === 0 ? "bg-green-900" : "hover:text-black hover:bg-white"
          }`}
          onClick={() => {
            setOptions(0);
            ChangeOptions();
            setError(null);
            setMaxValue(null);
            setMinValue(null);
          }}
        >
          Insert Element
        </button>
        <button
          className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${
            options === 1 ? "bg-green-900" : "hover:text-black hover:bg-white"
          }`}
          onClick={() => {
            setOptions(1);
            ChangeOptions();
            setHeapifyElements(null);
            setMaxHeapifyElements(null);
            setMinHeapifyElements(null);
            setError(null);
          }}
        >
          Extract Element
        </button>
        <button
          className={`mx-auto text-lg cursor-pointer border-2 border-yellow-300 p-2 rounded font-semibold ${
            options === 2 ? "bg-green-900" : "hover:text-black hover:bg-white"
          }`}
          onClick={() => {
            setOptions(2);
            ChangeOptions();
            setHeapifyElements(null);
            setMaxHeapifyElements(null);
            setMinHeapifyElements(null);
            setError(null);
          }}
        >
          Heapify Elements
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 border-b-2 font-semibold cursor-pointer ${
            heapTab === "max"
              ? "border-yellow-300 text-yellow-300"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setHeapTab("max")}
        >
          Max Heap
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-semibold cursor-pointer ${
            heapTab === "min"
              ? "border-yellow-300 text-yellow-300"
              : "border-transparent text-gray-400"
          }`}
          onClick={() => setHeapTab("min")}
        >
          Min Heap
        </button>
      </div>
      {options === 0 && (
        <div className="border-t-2 border-b-2 pt-5">
          <div className="flex flex-col items-center my-5">
            <div className="flex flex-row items-center w-full max-w-md">
              <label className="w-48 text-right mr-4">Enter value to insert</label>
              <input
                type="number"
                value={value === null ? "" : value}
                onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
                className="bg-white text-black pl-2 flex-1"
              />
            </div>
          </div>
          <div className="flex justify-center mt-10 mb-5">
            <button
              className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={insert}
              disabled={value === null}
            >
              Insert
            </button>
          </div>
        </div>
      )}
      {options === 1 && (
        <div className="flex justify-center mt-10 mb-5">
          <button
            className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white "
            onClick={extract}
          >
            Extract
          </button>
        </div>
      )}
      {options === 2 && (
        <div className="border-t-2 border-b-2 pt-5">
          <div className="flex flex-col items-center my-5">
            <div className="flex flex-row items-center w-full max-w-md">
              <label className="w-48 text-right mr-4">Enter values to heapify</label>
              <input
                type="text"
                value={heapifyElements === null ? "" : heapifyElements}
                onChange={(e) => setHeapifyElements(e.target.value === "" ? null : e.target.value)}
                className="bg-white text-black pl-2 flex-1"
                placeholder="6, 12, 4, 2, 8, ..."
              />
            </div>
          </div>
          <div className="flex justify-center mt-10 mb-5">
            <button
              className="mx-auto cursor-pointer border-2 border-yellow-300 p-2 rounded hover:text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={heapify}
              disabled={heapifyElements === null}
            >
              Heapify
            </button>
          </div>
        </div>
      )}
      <div className="mt-5">
        {message && (
          <p
            className={`text-center mb-3 font-semibold ${
              message === "False" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        {error && <p className="text-red-500 text-center mt-3 font-semibold">{error}</p>}
        <div className="flex flex-col items-center overflow-auto py-2">
            {options === 2 ? (
                heapTab === "max" ? (
                <HeapSVGTree elements={maxHeapifyElements} title="Max Heap (Heapify)" />
                ) : (
                <HeapSVGTree elements={minHeapifyElements} title="Min Heap (Heapify)" />
                )
            ) : heapTab === "max" ? (
                <HeapSVGTree elements={maxHeapElements} title="Max Heap" />
            ) : (
                <HeapSVGTree elements={minHeapElements} title="Min Heap" />
            )}
            {options === 1 && maxValue !== null && heapTab === "max" && (
            <div className="mt-4 text-yellow-300">
                <span className="font-bold">Extracted Max:</span> {maxValue}
            </div>
            )}
            {options === 1 && minValue !== null && heapTab === "min" && (
            <div className="mt-1 text-yellow-300">
                <span className="font-bold">Extracted Min:</span> {minValue}
            </div>
            )}
        </div>
      </div>
    </div>
  );
}