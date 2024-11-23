import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { bubbleSort, insertionSort, selectionSort, quickSort, mergeSort, SortStep } from './sorting-algorithms';
import { useMediaQuery } from 'react-responsive';


type SortingAlgorithm = 'bubble' | 'insertion' | 'selection' | 'quick' | 'merge'

const algorithmInfo = {
  bubble: {
    id: 0,
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
  },
  insertion: {
    id: 1,
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    code: `function insertionSort(arr) {
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
}`
  },
  selection: {
    id: 2,
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    code: `function selectionSort(arr) {
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
}`
  },
  quick: {
    id: 3,
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    code: `function quickSort(arr, low = 0, high = arr.length - 1) {
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
}`
  },
  merge: {
    id: 4,
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    code: `function mergeSort(arr, left = 0, right = arr.length - 1) {
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
};

export default function SortingVisualizer() {
  const isMobile: boolean = useMediaQuery({ query: '(max-width: 768px)' });
  const maxSpeed = 10;
  const initStep = {array: [], comparingIndices: [], window: [], currentLine: 0, sorted: false};
  const [array, setArray] = useState<number[]>([])
  const [sorting, setSorting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble')
  const [speed, setSpeed] = useState(1)
  const [size, setSize] = useState(10)
  const [currentStep, setCurrentStep] = useState<SortStep>(initStep)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

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
    setCurrentStep(initStep)
    setExecutionTime(null)
  }, [size])

  useEffect(() => {
    resetArray()
  }, [size, resetArray])

  const runSortingAlgorithm = async () => {
    setSorting(true)
    setCompleted(false)
    setExecutionTime(null)

    const startTime = performance.now()
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
    const endTime = performance.now()
    setExecutionTime(endTime - startTime)

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])
      setArray(steps[i].array)
      await new Promise(resolve => setTimeout(resolve, getDelayFromSpeed(speed)))

      if (i === steps.length - 1) {
        setCompleted(true)
      }
    }

    setSorting(false)
  }

  const getDelayFromSpeed = (speed: number) => {
    return (25 * (maxSpeed - speed + 1))
  }

  const getEleColor = (idx: number) => {
    if (completed)
      return 'bg-green-500';

    if (currentStep.comparingIndices.includes(idx))
      return 'bg-yellow-500';

    
    if (currentStep?.window.length > 0) {
      console.log(algorithmInfo[algorithm].id, idx);
      if (algorithmInfo[algorithm].id == 0 && idx > currentStep?.window[1])
        return 'bg-green-500';
      if (algorithmInfo[algorithm].id == 2 && idx < currentStep?.window[0])
        return 'bg-green-500';

      if (idx >= currentStep?.window[0] && idx <= currentStep?.window[1])
        return 'bg-blue-300';
    }

    return 'bg-blue-500';
  }

  return (
    <div className="min-h-screen w-full bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl mb-8">
          Sorting Algorithms Visualizer
        </h1>
        
        {/* Controls Section */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:flex-wrap sm:justify-center">
          <div className="w-full sm:w-auto">
            <Select
              value={algorithm}
              onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}
              disabled={sorting}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(algorithmInfo).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-[200px]">
            <label className="block text-sm font-medium mb-1">Array Size: {size}</label>
            <Slider
              min={4}
              max={30}
              step={1}
              value={[size]}
              onValueChange={([value]) => setSize(value)}
              disabled={sorting}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-[200px]">
            <label className="block text-sm font-medium mb-1">Speed: {speed}</label>
            <Slider
              min={1}
              max={maxSpeed}
              step={1}
              value={[speed]}
              onValueChange={([value]) => setSpeed(value)}
              disabled={sorting}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={resetArray} 
              disabled={sorting}
              className="flex-1 sm:flex-none"
            >
              Generate New Array
            </Button>
            <Button 
              onClick={runSortingAlgorithm} 
              disabled={sorting}
              className="flex-1 sm:flex-none"
            >
              Sort!
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visualization Card */}
          <Card className="order-1 lg:order-none">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Visualization</h2>
              <div className="h-[200px] sm:h-[300px] md:h-[400px] flex items-end justify-center">
                {array.map((value, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: `${value * (isMobile? 2: 3)}px`,
                      width: `${90 / size}%`,
                    }}
                    // ${(algorithmInfo[algorithm].id == 0 && currentStep?.array.length < array.length && idx > currentStep?.array.length)? 
                    //   'bg-green-500': ''
                    //     }
                    className={
                      `m-[1px] text-white flex justify-center items-center transition-all duration-250 ease-in-out
                      ${getEleColor(idx)}`
                    }
                  >{value}</div>
                ))}
              </div>
              {completed && executionTime !== null && (
                <p className="mt-4 text-center text-sm sm:text-base">
                  Sorting completed in {executionTime.toFixed(2)} ms
                </p>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Code Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {algorithmInfo[algorithm].name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Time Complexity: {algorithmInfo[algorithm].timeComplexity}
                </p>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs sm:text-sm">
                  {algorithmInfo[algorithm].code.split('\n').map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        currentStep?.currentLine === index + 1 ? 'bg-yellow-200' : ''
                      } ${line.trim() === '' ? 'h-4' : ''}`}
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-center items-center gap-2 mt-8'>

          <div>
            <div className='w-4 h-4 mx-auto bg-green-500'></div>
            <p>Sorted Elements</p>
          </div>

          <div>

            <div className='w-4 h-4 mx-auto bg-yellow-500'></div>
            <p>Comparing Elements</p>
          </div>

          <div>

            <div className='w-4 h-4 mx-auto bg-blue-300'></div>
            <p>Iterating window</p>
          </div>
          <div>

            <div className='w-4 h-4 mx-auto bg-blue-500'></div>
            <p>Unsorted Elements</p>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          Developed by Aman Verma
        </footer>
      </div>
    </div>
  )
}