"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
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

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubbleSort");
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const speedRef = useRef(speed);
  const sortingRef = useRef(sorting);
  const pausedRef = useRef(paused);
  const stopSortingRef = useRef(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    speedRef.current = speed;
    sortingRef.current = sorting;
    pausedRef.current = paused;
    isMutedRef.current = isMuted;
  }, [speed, sorting, paused, isMuted]);

  useEffect(() => {
    const storedMuteState = localStorage.getItem("sortingVisualizerMuted");
    if (storedMuteState !== null) {
      setIsMuted(storedMuteState === "true");
    }
  }, []);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from(
      { length: ARRAY_SIZE },
      () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
    );
    setArray(newArray);
    setInitialArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setIsSorted(false);
    setIsInitialState(true);
  }, []);

  useEffect(() => {
    generateRandomArray();
    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }, [generateRandomArray]);

  const playSound = (frequency: number) => {
    if (audioContext.current && !isMutedRef.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.current.currentTime
      );
      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioContext.current.currentTime + 0.1
      );
      oscillator.stop(audioContext.current.currentTime + 0.1);
    }
  };

  const sleep = async (ms: number) => {
    return new Promise((resolve) => {
      if (stopSortingRef.current) {
        throw new Error("Sorting stopped");
      }
      setTimeout(resolve, ms);
    });
  };

  const checkIfSorted = useCallback(() => {
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i - 1]) {
        return false;
      }
    }
    return true;
  }, [array]);

  useEffect(() => {
    const sorted = checkIfSorted();
    setIsSorted(sorted);
    setIsInitialState(JSON.stringify(array) === JSON.stringify(initialArray));

    if (sorted && !isInitialState) {
      toast({
        title: "Sorting Complete",
        description: `${algorithm} finished with ${comparisons} comparisons and ${swaps} swaps.`,
      });
    }
  }, [
    array,
    initialArray,
    algorithm,
    comparisons,
    swaps,
    checkIfSorted,
    isInitialState,
  ]);

  const runSortingAlgorithm = async () => {
    setSorting(true);
    setPaused(false);
    setComparisons(0);
    setSwaps(0);
    stopSortingRef.current = false;

    const sortFunction = {
      bubbleSort,
      quickSort,
      mergeSort,
      selectionSort,
      insertionSort,
    }[algorithm];

    if (sortFunction) {
      try {
        await sortFunction(
          [...array],
          (newArray) => {
            setArray(newArray);
            setIsInitialState(false);
          },
          setComparisons,
          setSwaps,
          () => speedRef.current,
          async () => {
            while (pausedRef.current) {
              await sleep(100);
            }
            await sleep(101 - speedRef.current);
          },
          (value) => playSound(200 + value * 5),
          () => stopSortingRef.current
        );
      } catch (error: any) {
        if (error.message !== "Sorting stopped") {
          console.error("Sorting error:", error);
        }
      }
    }

    setSorting(false);
  };

  const handleReset = () => {
    stopSortingRef.current = true;
    setSorting(false);
    setPaused(false);
    setArray([...initialArray]);
    setComparisons(0);
    setSwaps(0);
    setIsSorted(false);
    setIsInitialState(true);
  };

  const handlePauseResume = () => {
    setPaused(!paused);
  };

  const handleToggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem("sortingVisualizerMuted", newMuteState.toString());
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-4xl">
        Sorting Algorithm Visualizer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          onValueChange={setAlgorithm}
          value={algorithm}
          disabled={sorting || isSorted}
        >
          <SelectTrigger>
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
            className="flex-grow"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        <Button onClick={generateRandomArray} disabled={sorting}>
          New Array
        </Button>
        <Button onClick={runSortingAlgorithm} disabled={sorting || isSorted}>
          Start Sorting
        </Button>
        <Button onClick={handlePauseResume} disabled={!sorting}>
          {paused ? (
            <Play className="mr-2 h-4 w-4" />
          ) : (
            <Pause className="mr-2 h-4 w-4" />
          )}
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={isInitialState}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleToggleMute} variant="outline">
          {isMuted ? (
            <VolumeX className="mr-2 h-4 w-4" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
      </div>
      <div className="h-56 sm:h-64 bg-gray-100 dark:bg-gray-800 relative rounded-lg overflow-hidden">
        {array.map((value, index) => (
          <div
            key={index}
            className="absolute bottom-0 bg-blue-500 dark:bg-blue-400 transition-all duration-100"
            style={{
              height: `${value}%`,
              width: `${100 / ARRAY_SIZE}%`,
              left: `${(index * 100) / ARRAY_SIZE}%`,
            }}
          ></div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
}
