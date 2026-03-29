// Each function returns an array of "steps" for animation
// Each step: { array, comparing, swapping, sorted, pivot, description }

export function bubbleSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = new Set();

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Comparing a[${j}]=${a[j]} with a[${j+1}]=${a[j+1]}`,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          array: [...a],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Swapped! a[${j}] and a[${j+1}]`,
        });
      }
    }
    sorted.add(a.length - i - 1);
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(a.length).keys()], description: "Sorted!" });
  return steps;
}

export function selectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = new Set();

  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({
        array: [...a],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        pivot: i,
        description: `Finding min: comparing a[${j}]=${a[j]} with current min a[${minIdx}]=${a[minIdx]}`,
      });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({
        array: [...a],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Placed minimum ${a[i]} at position ${i}`,
      });
    }
    sorted.add(i);
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(a.length).keys()], description: "Sorted!" });
  return steps;
}

export function insertionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = new Set([0]);

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({
      array: [...a],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      description: `Picking element a[${i}]=${key} to insert into sorted portion`,
    });
    while (j >= 0 && a[j] > key) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Shifting a[${j}]=${a[j]} right to make room`,
      });
      a[j + 1] = a[j];
      a[j] = key;
      steps.push({
        array: [...a],
        comparing: [],
        swapping: [j, j + 1],
        sorted: [...sorted],
        description: `Shifted: a[${j}]=${a[j]}, a[${j+1}]=${a[j+1]}`,
      });
      j--;
    }
    sorted.add(i);
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(a.length).keys()], description: "Sorted!" });
  return steps;
}

export function mergeSortSteps(arr) {
  const steps = [];
  const a = [...arr];

  function mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        description: `Merging: comparing ${leftArr[i]} and ${rightArr[j]}`,
      });
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k - 1],
        sorted: [],
        description: `Placed ${arr[k-1]} at position ${k-1}`,
      });
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; }
  }

  mergeSort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(a.length).keys()], description: "Sorted!" });
  return steps;
}

export function quickSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = new Set();

  function quickSort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      sorted.add(pi);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    } else if (low === high) sorted.add(low);
  }

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: high,
      description: `Pivot selected: ${pivot} at index ${high}`,
    });
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        pivot: high,
        description: `Comparing a[${j}]=${arr[j]} with pivot=${pivot}`,
      });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, j],
          sorted: [...sorted],
          pivot: high,
          description: `Swap: a[${i}]=${arr[i]} moved left of pivot`,
        });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [...sorted],
      pivot: i + 1,
      description: `Pivot ${pivot} placed at correct position ${i+1}`,
    });
    return i + 1;
  }

  quickSort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(a.length).keys()], description: "Sorted!" });
  return steps;
}

export function heapSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;

  function heapify(arr, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    steps.push({
      array: [...arr],
      comparing: [i, l < n ? l : i, r < n ? r : i].filter((x, idx, self) => self.indexOf(x) === idx),
      swapping: [],
      sorted: [],
      description: `Heapify at index ${i}: checking children`,
    });

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, largest],
        sorted: [],
        description: `Swap: a[${i}]=${arr[i]} and a[${largest}]=${arr[largest]} to maintain heap`,
      });
      heapify(arr, n, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);

  // Extract elements
  const sorted = new Set();
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    steps.push({
      array: [...a],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
      description: `Extracted max ${a[i]}, placed at position ${i}`,
    });
    heapify(a, i, 0);
  }
  sorted.add(0);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...Array(n).keys()], description: "Sorted!" });
  return steps;
}
