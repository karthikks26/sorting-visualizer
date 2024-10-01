"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

import {
  bubbleSort,
  quickSort,
  mergeSort,
  selectionSort,
  insertionSort,
} from "@/lib/sortingAlgorithms";

const ARRAY_SIZE = 50;
const MIN_VALUE = 5;
const MAX_VALUE = 100;

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubbleSort");
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from(
      { length: ARRAY_SIZE },
      () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
    );
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
  }, []);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const runSortingAlgorithm = async () => {
    setSorting(true);
    setComparisons(0);
    setSwaps(0);

    const sortFunction = {
      bubbleSort,
      quickSort,
      mergeSort,
      selectionSort,
      insertionSort,
    }[algorithm];

    if (sortFunction) {
      await sortFunction(
        array,
        setArray,
        setComparisons,
        setSwaps,
        speed,
        sleep
      );
    }

    setSorting(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <Select onValueChange={setAlgorithm} value={algorithm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bubbleSort">Bubble Sort</SelectItem>
            <SelectItem value="quickSort">Quick Sort</SelectItem>
            <SelectItem value="mergeSort">Merge Sort</SelectItem>
            <SelectItem value="selectionSort">Selection Sort</SelectItem>
            <SelectItem value="insertionSort">Insertion Sort</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Speed:</span>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            className="w-[200px]"
          />
        </div>
        <Button onClick={generateRandomArray} disabled={sorting}>
          Generate New Array
        </Button>
        <Button onClick={runSortingAlgorithm} disabled={sorting}>
          {sorting ? "Sorting..." : "Start Sorting"}
        </Button>
      </div>
      <div className="h-64 bg-gray-100 dark:bg-gray-800 relative">
        {array.map((value, index) => (
          <div
            key={index}
            className="absolute bottom-0 bg-blue-500"
            style={{
              height: `${value}%`,
              width: `${100 / ARRAY_SIZE}%`,
              left: `${(index * 100) / ARRAY_SIZE}%`,
            }}
          ></div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Comparisons: {comparisons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold">Swaps: {swaps}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;
