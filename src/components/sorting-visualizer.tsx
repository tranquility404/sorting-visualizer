import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { bubbleSort, insertionSort, selectionSort, quickSort, mergeSort } from './sorting-algorithms'

type SortingAlgorithm = 'bubble' | 'insertion' | 'selection' | 'quick' | 'merge'

interface SortStep {
  array: number[]
  comparingIndices: number[]
  currentLine: number
}

const algorithmCode = {
  bubble: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  insertion: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  selection: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
  quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  merge: `function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  return arr;
}

function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }
  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    i++;
    k++;
  }
  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    j++;
    k++;
  }
}`
}

export function SortingVisualizerComponent() {
  const [array, setArray] = useState<number[]>([])
  const [sorting, setSorting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble')
  const [speed, setSpeed] = useState(50)
  const [size, setSize] = useState(50)
  const [currentStep, setCurrentStep] = useState<SortStep | null>(null)

  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const resetArray = useCallback(() => {
    const newArray = []
    for (let i = 0; i < size; i++) {
      newArray.push(randomIntFromInterval(5, 100))
    }
    setArray(newArray)
    setCompleted(false)
    setCurrentStep(null)
  }, [size])

  useEffect(() => {
    resetArray()
  }, [size, resetArray])

  const runSortingAlgorithm = async () => {
    setSorting(true)
    setCompleted(false)

    let steps: SortStep[] = []
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
      setCurrentStep(steps[i])
      setArray(steps[i].array)
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
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Visualization</h2>
            <div className="h-[400px] flex items-end justify-center">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${value * 3}px`,
                    width: `${90 / size}%`,
                  }}
                  className={`m-[1px] ${
                    completed
                      ? 'bg-green-500'
                      : currentStep?.comparingIndices.includes(idx)
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Algorithm Code</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {algorithmCode[algorithm].split('\n').map((line, index) => (
                <div
                  key={index}
                  className={currentStep?.currentLine === index + 1 ? 'bg-yellow-200' : ''}
                >
                  {line}
                </div>
              ))}
            </pre>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        Developed by Aman Verma
      </footer>
    </div>
  )
}