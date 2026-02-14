export type CodeTemplate = {
    python: string
    javascript: string
    timeComplexity: string
    spaceComplexity: string
}

export const codeTemplates: Record<string, CodeTemplate> = {
    // --- Two Pointers ---
    'opposite_direction': {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        python: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1 # Need smaller sum
            
    return []`,
        javascript: `function twoSumSorted(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        const sum = arr[left] + arr[right];

        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++; // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    return [];
}`
    },
    'same_direction': {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        python: `def move_zeroes(arr):
    left = 0  # Position for non-zero
    
    for right in range(len(arr)):
        if arr[right] != 0:
            # Swap non-zero to 'left' position
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            
    return arr`,
        javascript: `function moveZeroes(arr) {
    let left = 0; // Position for non-zero

    for (let right = 0; right < arr.length; right++) {
        if (arr[right] !== 0) {
            // Swap non-zero to 'left' position
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
        }
    }
    return arr;
}`
    },
    'partition': {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1  # Index of smaller element
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
        javascript: `function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`
    },

    // --- Binary Search ---
    'standard': {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1`,
        javascript: `function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`
    },
    'lower_bound': {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        python: `def lower_bound(arr, target):
    low, high = 0, len(arr)
    
    while low < high:
        mid = low + (high - low) // 2
        
        if arr[mid] >= target:
            high = mid
        else:
            low = mid + 1
            
    return low`,
        javascript: `function lowerBound(arr, target) {
    let low = 0;
    let high = arr.length;

    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);

        if (arr[mid] >= target) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}`
    },
    'upper_bound': {
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        python: `def upper_bound(arr, target):
    low, high = 0, len(arr)
    
    while low < high:
        mid = low + (high - low) // 2
        
        if arr[mid] > target:
            high = mid
        else:
            low = mid + 1
            
    return low`,
        javascript: `function upperBound(arr, target) {
    let low = 0;
    let high = arr.length;

    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);

        if (arr[mid] > target) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    return low;
}`
    }
}
