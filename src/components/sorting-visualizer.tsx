import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { bubbleSort, insertionSort, selectionSort, quickSort, mergeSort } from './sortingAlgorithms'

type SortingAlgorithm = 'bubble' | 'insertion' | 'selection' | 'quick' | 'merge'

export function SortingVisualizerComponent() {
  const [array, setArray] = useState<number[]>([])
  const [sorting, setSorting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble')
  const [speed, setSpeed] = useState(50)
  const [size, setSize] = useState(50)

  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const resetArray = useCallback(() => {
    const newArray = []
    for (let i = 0; i < size; i++) {
      newArray.push(randomIntFromInterval(5, 500))
    }
    setArray(newArray)
    setCompleted(false)
  }, [size])

  useEffect(() => {
    resetArray()
  }, [size, resetArray])

  const runSortingAlgorithm = async () => {
    setSorting(true)
    setCompleted(false)

    let steps: number[][] = []
    switch (algorithm) {
      case 'bubble':
        steps = bubbleSort([...array])
        break
      case 'insertion':
        steps = insertionSort([...array])
        break
      case 'selection':
        steps = selectionSort([...array])
        break
      case 'quick':
        steps = quickSort([...array])
        break
      case 'merge':
        steps = mergeSort([...array])
        break
    }

    for (let i = 0; i < steps.length; i++) {
      if (i === steps.length - 1) {
        setCompleted(true)
      }
      setArray(steps[i])
      await new Promise(resolve => setTimeout(resolve, 101 - speed))
    }

    setSorting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Sorting Algorithms Visualizer</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Select
          value={algorithm}
          onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}
          disabled={sorting}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bubble">Bubble Sort</SelectItem>
            <SelectItem value="insertion">Insertion Sort</SelectItem>
            <SelectItem value="selection">Selection Sort</SelectItem>
            <SelectItem value="quick">Quick Sort</SelectItem>
            <SelectItem value="merge">Merge Sort</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Array Size: {size}</label>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[size]}
            onValueChange={([value]) => setSize(value)}
            disabled={sorting}
            className="w-[200px]"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">Speed: {speed}</label>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            disabled={sorting}
            className="w-[200px]"
          />
        </div>
        <Button onClick={resetArray} disabled={sorting}>
          Generate New Array
        </Button>
        <Button onClick={runSortingAlgorithm} disabled={sorting}>
          Sort!
        </Button>
      </div>
      <div className="h-[500px] flex items-end justify-center">
        {array.map((value, idx) => (
          <div
            key={idx}
            style={{
              height: `${value}px`,
              width: `${90 / size}%`,
            }}
            className={`m-[1px] ${
              completed ? 'bg-green-500' : 'bg-blue-500'
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}