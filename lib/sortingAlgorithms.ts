type SetArrayFunction = React.Dispatch<React.SetStateAction<number[]>>;
type SetNumberFunction = React.Dispatch<React.SetStateAction<number>>;
type GetSpeedFunction = () => number;
type SleepFunction = () => Promise<void>;
type PlaySoundFunction = (value: number) => void;
type CheckStopFunction = () => boolean;

export const bubbleSort = async (
  arr: number[],
  setArray: SetArrayFunction,
  setComparisons: SetNumberFunction,
  setSwaps: SetNumberFunction,
  getSpeed: GetSpeedFunction,
  sleep: SleepFunction,
  playSound: PlaySoundFunction,
  checkStop: CheckStopFunction
) => {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (checkStop()) return;
      setComparisons((prev) => prev + 1);
      if (arr[j] > arr[j + 1]) {
        setSwaps((prev) => prev + 1);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setArray([...arr]);
        playSound(arr[j]);
        await sleep();
      }
    }
  }
};

export const quickSort = async (
  arr: number[],
  setArray: SetArrayFunction,
  setComparisons: SetNumberFunction,
  setSwaps: SetNumberFunction,
  getSpeed: GetSpeedFunction,
  sleep: SleepFunction,
  playSound: PlaySoundFunction,
  checkStop: CheckStopFunction
) => {
  const partition = async (low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (checkStop()) return -1;
      setComparisons((prev) => prev + 1);
      if (arr[j] < pivot) {
        i++;
        setSwaps((prev) => prev + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        playSound(arr[i]);
        await sleep();
      }
    }

    setSwaps((prev) => prev + 1);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    playSound(arr[i + 1]);
    await sleep();

    return i + 1;
  };

  const sort = async (low: number, high: number) => {
    if (low < high) {
      const pi = await partition(low, high);
      if (pi === -1) return; // Sorting stopped
      await sort(low, pi - 1);
      await sort(pi + 1, high);
    }
  };

  await sort(0, arr.length - 1);
};

export const mergeSort = async (
  arr: number[],
  setArray: SetArrayFunction,
  setComparisons: SetNumberFunction,
  setSwaps: SetNumberFunction,
  getSpeed: GetSpeedFunction,
  sleep: SleepFunction,
  playSound: PlaySoundFunction,
  checkStop: CheckStopFunction
) => {
  const merge = async (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < n1 && j < n2) {
      if (checkStop()) return;
      setComparisons((prev) => prev + 1);
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      setSwaps((prev) => prev + 1);
      k++;
      setArray([...arr]);
      playSound(arr[k - 1]);
      await sleep();
    }

    while (i < n1) {
      if (checkStop()) return;
      arr[k] = L[i];
      i++;
      k++;
      setSwaps((prev) => prev + 1);
      setArray([...arr]);
      playSound(arr[k - 1]);
      await sleep();
    }

    while (j < n2) {
      if (checkStop()) return;
      arr[k] = R[j];
      j++;
      k++;
      setSwaps((prev) => prev + 1);
      setArray([...arr]);
      playSound(arr[k - 1]);
      await sleep();
    }
  };

  const sort = async (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await sort(left, mid);
      await sort(mid + 1, right);
      await merge(left, mid, right);
    }
  };

  await sort(0, arr.length - 1);
};

export const selectionSort = async (
  arr: number[],
  setArray: SetArrayFunction,
  setComparisons: SetNumberFunction,
  setSwaps: SetNumberFunction,
  getSpeed: GetSpeedFunction,
  sleep: SleepFunction,
  playSound: PlaySoundFunction,
  checkStop: CheckStopFunction
) => {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    if (checkStop()) return;
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      setComparisons((prev) => prev + 1);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      setSwaps((prev) => prev + 1);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      playSound(arr[i]);
      await sleep();
    }
  }
};

export const insertionSort = async (
  arr: number[],
  setArray: SetArrayFunction,
  setComparisons: SetNumberFunction,
  setSwaps: SetNumberFunction,
  getSpeed: GetSpeedFunction,
  sleep: SleepFunction,
  playSound: PlaySoundFunction,
  checkStop: CheckStopFunction
) => {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    if (checkStop()) return;
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (checkStop()) return;
      setComparisons((prev) => prev + 1);
      setSwaps((prev) => prev + 1);
      arr[j + 1] = arr[j];
      j = j - 1;
      setArray([...arr]);
      playSound(arr[j + 1]);
      await sleep();
    }
    arr[j + 1] = key;
    setArray([...arr]);
    playSound(arr[j + 1]);
    await sleep();
  }
};
