interface SortStep {
  array: number[]
  comparingIndices: number[]
  currentLine: number
}

export function bubbleSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...arr], comparingIndices: [j, j + 1], currentLine: 3 });
      if (arr[j] > arr[j + 1]) {
        steps.push({ array: [...arr], comparingIndices: [j, j + 1], currentLine: 4 });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ array: [...arr], comparingIndices: [j, j + 1], currentLine: 5 });
      }
    }
  }
  return steps
}

export function insertionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  for (let i = 1; i < n; i++) {
    let key = arr[i]
    let j = i - 1
    steps.push({ array: [...arr], comparingIndices: [i], currentLine: 3 })
    steps.push({ array: [...arr], comparingIndices: [i, j], currentLine: 4 })
    while (j >= 0 && arr[j] > key) {
      steps.push({ array: [...arr], comparingIndices: [j, j + 1], currentLine: 5 })
      arr[j + 1] = arr[j]
      steps.push({ array: [...arr], comparingIndices: [j, j + 1], currentLine: 6 })
      j = j - 1
      steps.push({ array: [...arr], comparingIndices: [j + 1], currentLine: 7 })
    }
    arr[j + 1] = key
    steps.push({ array: [...arr], comparingIndices: [j + 1], currentLine: 9 })
  }
  return steps
}

export function selectionSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({ array: [...arr], comparingIndices: [i], currentLine: 3 })
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...arr], comparingIndices: [minIdx, j], currentLine: 5 })
      if (arr[j] < arr[minIdx]) {
        steps.push({ array: [...arr], comparingIndices: [minIdx, j], currentLine: 6 })
        minIdx = j
        steps.push({ array: [...arr], comparingIndices: [minIdx], currentLine: 7 })
      }
    }
    if (minIdx !== i) {
      steps.push({ array: [...arr], comparingIndices: [i, minIdx], currentLine: 10 });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({ array: [...arr], comparingIndices: [i, minIdx], currentLine: 11 });
    }
  }
  return steps
}

export function quickSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []
  
  function partition(low: number, high: number): number {
    const pivot = arr[high]
    steps.push({ array: [...arr], comparingIndices: [high], currentLine: 14 })
    let i = low - 1
    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparingIndices: [j, high], currentLine: 16 })
      if (arr[j] < pivot) {
        i++
        steps.push({ array: [...arr], comparingIndices: [i, j], currentLine: 18 });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ array: [...arr], comparingIndices: [i, j], currentLine: 19 });
      }
    }
    steps.push({ array: [...arr], comparingIndices: [i + 1, high], currentLine: 22 });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], comparingIndices: [i + 1, high], currentLine: 23 });
    return i + 1
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      steps.push({ array: [...arr], comparingIndices: [low, high], currentLine: 2 })
      const pi = partition(low, high)
      steps.push({ array: [...arr], comparingIndices: [pi], currentLine: 3 })
      quickSortHelper(low, pi - 1)
      quickSortHelper(pi + 1, high)
    }
  }

  quickSortHelper(0, arr.length - 1)
  return steps
}

export function mergeSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = []

  function merge(left: number, mid: number, right: number) {
    steps.push({ array: [...arr], comparingIndices: [left, mid, right], currentLine: 13 })
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0, j = 0, k = left
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ array: [...arr], comparingIndices: [left + i, mid + 1 + j], currentLine: 17 })
      if (leftArr[i] <= rightArr[j]) {
        steps.push({ array: [...arr], comparingIndices: [k, left + i], currentLine: 18 })
        arr[k] = leftArr[i]
        i++
      } else {
        steps.push({ array: [...arr], comparingIndices: [k, mid + 1 + j], currentLine: 21 })
        arr[k] = rightArr[j]
        j++
      }
      k++
      steps.push({ array: [...arr], comparingIndices: [k - 1], currentLine: 24 })
    }
    while (i < leftArr.length) {
      steps.push({ array: [...arr], comparingIndices: [k, left + i], currentLine: 26 })
      arr[k] = leftArr[i]
      i++
      k++
      steps.push({ array: [...arr], comparingIndices: [k - 1], currentLine: 29 })
    }
    while (j < rightArr.length) {
      steps.push({ array: [...arr], comparingIndices: [k, mid + 1 + j], currentLine: 31 })
      arr[k] = rightArr[j]
      j++
      k++
      steps.push({ array: [...arr], comparingIndices: [k - 1], currentLine: 34 })
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      steps.push({ array: [...arr], comparingIndices: [left, right], currentLine: 2 })
      const mid = Math.floor((left + right) / 2)
      steps.push({ array: [...arr], comparingIndices: [left, mid, right], currentLine: 3 })
      mergeSortHelper(left, mid)
      mergeSortHelper(mid + 1, right)
      merge(left, mid, right)
    }
  }

  mergeSortHelper(0, arr.length - 1)
  return steps
}