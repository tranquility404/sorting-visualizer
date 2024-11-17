export function bubbleSort(arr: number[]): number[][] {
    const steps: number[][] = []
    const n = arr.length
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          steps.push([...arr])
        }
      }
    }
    return steps
  }
  
  export function insertionSort(arr: number[]): number[][] {
    const steps: number[][] = []
    const n = arr.length
    for (let i = 1; i < n; i++) {
      let key = arr[i]
      let j = i - 1
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j]
        j = j - 1
        steps.push([...arr])
      }
      arr[j + 1] = key
      steps.push([...arr])
    }
    return steps
  }
  
  export function selectionSort(arr: number[]): number[][] {
    const steps: number[][] = []
    const n = arr.length
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        steps.push([...arr])
      }
    }
    return steps
  }
  
  export function quickSort(arr: number[]): number[][] {
    const steps: number[][] = []
    
    function partition(low: number, high: number): number {
      const pivot = arr[high]
      let i = low - 1
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++
          [arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push([...arr])
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      steps.push([...arr])
      return i + 1
    }
  
    function quickSortHelper(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high)
        quickSortHelper(low, pi - 1)
        quickSortHelper(pi + 1, high)
      }
    }
  
    quickSortHelper(0, arr.length - 1)
    return steps
  }
  
  export function mergeSort(arr: number[]): number[][] {
    const steps: number[][] = []
  
    function merge(left: number, mid: number, right: number) {
      const leftArr = arr.slice(left, mid + 1)
      const rightArr = arr.slice(mid + 1, right + 1)
      let i = 0, j = 0, k = left
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i]
          i++
        } else {
          arr[k] = rightArr[j]
          j++
        }
        k++
        steps.push([...arr])
      }
      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        i++
        k++
        steps.push([...arr])
      }
      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        j++
        k++
        steps.push([...arr])
      }
    }
  
    function mergeSortHelper(left: number, right: number) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)
        mergeSortHelper(left, mid)
        mergeSortHelper(mid + 1, right)
        merge(left, mid, right)
      }
    }
  
    mergeSortHelper(0, arr.length - 1)
    return steps
  }