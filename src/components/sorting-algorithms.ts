export interface SortStep {
  array: number[]
  comparingIndices: number[]
  window: number[]
  currentLine: number
}
function step(array: number[], comparingIndices: number[], currentLine: number): SortStep;
function step(array: number[], comparingIndices: number[], window: number[], currentLine: number): SortStep;
function step(array: number[], currentLine: number): SortStep

function step(arg1: number[], arg2: number[]|number, arg3?: number|number[], arg4?: number): SortStep {
  if (Array.isArray(arg2) && typeof arg3 === "number")
    return {
      array: arg1,
      comparingIndices: arg2,
      window: [],
      currentLine: arg3
    }
  else if (Array.isArray(arg1) && Array.isArray(arg2) && Array.isArray(arg3))
    return {
      array: arg1,
      comparingIndices: arg2,
      window: arg3,
      currentLine: arg4 as number
    }
  else if (Array.isArray(arg1) && Array.isArray(arg2) && Array.isArray(arg3))
    return {
      array: arg1,
      comparingIndices: arg2,
      window: arg3,
      currentLine: arg4 as number
    }
  else
    return {
      array: arg1,
      comparingIndices: [],
      window: [],
      currentLine: arg2 as number
    }
}

export function bubbleSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  steps.push(step([...arr], 1 ));
  steps.push(step([...arr], 2 ));
  for (let i = 0; i < n - 1; i++) {
    steps.push(step([...arr], 3 ));
    for (let j = 0; j < n-i-1; j++) {
      let window = [0, n-i-1];
      steps.push(step([...arr], [], window, 4 ));
      steps.push(step([...arr], [j, j+1], window, 5 ));
      if (arr[j] > arr[j + 1]) {
        steps.push(step([...arr], [j, j+1], window, 6 ));
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
      steps.push(step([...arr], [], window, 7));
      console.log(j, j == n-i-2);
    }
    steps.push(step([...arr], 8));
  }
  steps.push(step([...arr], 10));
  return steps
}

export function insertionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  steps.push(step([...arr], 1));
  steps.push(step([...arr], 2)); 
  for (let i = 1; i < n; i++) {
    steps.push(step([...arr], 3));
    steps.push(step([...arr], 4));
    
    let key = arr[i]
    let j = i - 1
    steps.push(step([...arr], [i, j], 5));
    let window = [0, j];
    while (j >= 0 && arr[j] > key) {
      steps.push(step([...arr], [i, j], window, 6));
      steps.push(step([...arr], [i, j+1], window, 7));
      steps.push(step([...arr], [], window, 8));
      arr[j + 1] = arr[j]
      j = j - 1
    }
    steps.push(step([...arr], 9));
    steps.push(step([...arr], 10));
    arr[j + 1] = key
  }
  steps.push(step([...arr], 12));
  return steps
}

export function selectionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  steps.push(step([...arr], 1));
  steps.push(step([...arr], 2));
  for (let i = 0; i < n - 1; i++) {
    steps.push(step([...arr], [i], 3));
    steps.push(step([...arr], [i], 4));
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      let window = [i, n];
      steps.push(step([...arr], [minIdx, j], window, 5));
      steps.push(step([...arr], [minIdx, j], window, 6));
      if (arr[j] < arr[minIdx]) {
        steps.push(step([...arr], [minIdx, j], window, 7));
        minIdx = j
      }
    }
    steps.push(step([...arr], [minIdx], 9));
    steps.push(step([...arr], [minIdx], 10));
    if (minIdx !== i) {
      steps.push(step([...arr], [i, minIdx], 11));
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  steps.push(step([...arr], 13));
  steps.push(step([...arr], 14));
  return steps
}

export function quickSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  
  function partition(low: number, high: number): number {
    let window = [low, high];
    const pivot = arr[high]
    steps.push(step([...arr], [], window, 10));
    steps.push(step([...arr], [high], window, 11));
    let i = low - 1
    steps.push(step([...arr], [i], window, 12));
    for (let j = low; j < high; j++) {
      steps.push(step([...arr], [j, high], window, 13));
      steps.push(step([...arr], [j, high], window, 14));
      if (arr[j] < pivot) {
        steps.push(step([...arr], [], window, 15));
        steps.push(step([...arr], [i, j], window, 16));
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    steps.push(step([...arr], [], window, 18));
    steps.push(step([...arr], [i+1, high], window, 19));
    steps.push(step([...arr], [i+1], window, 20));
    steps.push(step([...arr], [], window, 21));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1
  }

  function quickSortHelper(low: number, high: number) {
    steps.push(step([...arr], 1));
    let window = [low, high];
    steps.push(step([...arr], [low, high], window, 2));
    if (low < high) {
      steps.push(step([...arr], [low, high], window, 3));
      const pi = partition(low, high)
      steps.push(step([...arr], [], window, 4));
      steps.push(step([...arr], [], window, 5));
      quickSortHelper(low, pi - 1)
      quickSortHelper(pi + 1, high)
    }
    steps.push(step([...arr], [], window, 7));
  }

  quickSortHelper(0, arr.length - 1)
  return steps
}

export function mergeSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []

  function merge(left: number, mid: number, right: number) {
    steps.push(step([...arr], 11));
    steps.push(step([...arr], 12));
    steps.push(step([...arr], 13));
    steps.push(step([...arr], 14));
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left
    while (i < leftArr.length && j < rightArr.length) {
      steps.push(step([...arr], 15));
      steps.push(step([...arr], 16));
      if (leftArr[i] <= rightArr[j]) {
        steps.push(step([...arr], [i, k], 17));
        steps.push(step([...arr], 18));
        arr[k] = leftArr[i]
        i++
      } else {
        steps.push(step([...arr], 19));
        steps.push(step([...arr], [k, j], 20));
        steps.push(step([...arr], 21));
        arr[k] = rightArr[j]
        j++
      }
      steps.push(step([...arr], 22));
      k++
    }
    steps.push(step([...arr], 23));
    while (i < leftArr.length) {
      steps.push(step([...arr], [i, k], 24));
      steps.push(step([...arr], 25));
      steps.push(step([...arr], 26));
      arr[k] = leftArr[i]
      i++
      k++
    }
    steps.push(step([...arr], [left, right], 28));
    while (j < rightArr.length) {
      steps.push(step([...arr], [k, j], 29));
      steps.push(step([...arr], 30));
      steps.push(step([...arr], 31));
      arr[k] = rightArr[j]
      j++
      k++
    }
    steps.push(step([...arr], 33));
  }

  function mergeSortHelper(left: number, right: number) {
    steps.push(step([...arr], 1));
    steps.push(step([...arr], [left, right], 2));
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      steps.push(step([...arr], [mid], 3));
      steps.push(step([...arr], [left, mid], 4));
      steps.push(step([...arr], [mid+1, right], 5));
      steps.push(step([...arr], [mid, right], 6));
      mergeSortHelper(left, mid)
      mergeSortHelper(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeSortHelper(0, arr.length - 1)
  steps.push(step([...arr], 8));
  return steps
}