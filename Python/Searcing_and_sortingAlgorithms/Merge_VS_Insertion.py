import random
import array
import time

def swap(an_array, a, b):
    # As a part of insertion sorting, this function swaps two values for further sorting
    # a - The index of the first element.
    # b - The index of the second element.
    temp = an_array[a]
    an_array[a] = an_array[b]
    an_array[b] = temp

def shift(an_array, index):
    # As a part of insertion sorting, this function shifts the values till it's 
    # in a correct position
    while index > 0 and an_array[index] < an_array[index - 1]:
        swap(an_array, index, index - 1)
        index -= 1

def insertion_sort(an_array):
    # This function is an insertion sort that uses shift and swap
    # Sorted in ascending order
    for index in range(1, len(an_array)):
        shift(an_array, index)

def generated_sorted_array(n):
    # Phase 1: Generating a random array of length n
    # Later sorted by insertion sort, to print sorted array
    rand_array = array.array('i')
    for _ in range(n):
        number = random.randint(1, 100)
        rand_array.append(number)
    # print(f"Unsorted array: {rand_array}")
    insertion_sort(rand_array)
    return rand_array

def binary_search(sorted_array, target, start=None, end=None):
    # Phase 2: Binary search function to find the target element
    # Divides the search interval in half each time
    if start is None and end is None:
        start = 0
        end = len(sorted_array) - 1
    if start > end:
        return None
    midpoint = (start + end) // 2
    if target == sorted_array[midpoint]:
        print(f"{target} is found on index {midpoint}")
        return midpoint
    elif target < sorted_array[midpoint]:
        return binary_search(sorted_array, target, start, midpoint - 1)
    else:
        return binary_search(sorted_array, target, midpoint + 1, end)

def merge_sort(data_list):
    # Phase 3: Recursive merge sort to sort larger datasets
    if len(data_list) > 1:
        middle = len(data_list) // 2
        left_half = data_list[:middle]
        right_half = data_list[middle:]

        # Recursive call on each half
        merge_sort(left_half)
        merge_sort(right_half)

        # Merging the sorted halves
        merge(data_list, left_half, right_half)

def merge(data_list, left_half, right_half):
    # This function merges two halves of a list in sorted order
    left_index = right_index = merged_index = 0

    # Compare elements and merge
    while left_index < len(left_half) and right_index < len(right_half):
        if left_half[left_index] < right_half[right_index]:
            data_list[merged_index] = left_half[left_index]
            left_index += 1
        else:
            data_list[merged_index] = right_half[right_index]
            right_index += 1
        merged_index += 1

    # Copy any remaining elements of left_half
    while left_index < len(left_half):
        data_list[merged_index] = left_half[left_index]
        left_index += 1
        merged_index += 1

    # Copy any remaining elements of right_half
    while right_index < len(right_half):
        data_list[merged_index] = right_half[right_index]
        right_index += 1
        merged_index += 1

def generate_large_sorted_array(size):
    # Phase 3: Generating a large random array with initial elements, then sorting using merge sort
    initial_numbers = [55, 22, 89, 34, 67, 90, 15, 72, 39, 44]
    data_array = array.array('i', initial_numbers)
    for _ in range(size - len(initial_numbers)):
        random_number = random.randint(1, 100)
        data_array.append(random_number)
    merge_sort(data_array)
    return data_array

def linear_search(data_list, target_value):
    # Phase 4: Performs a linear search to find the target in the list
    for index, value in enumerate(data_list):
        if value == target_value:
            return index
    return None

def main():
    # Main function updated to include Phases 3 and 4
    n = int(input("How many random numbers in array?: "))
    target = int(input("What number are we looking for in the sorted random array?: "))

    # For arrays larger than 10, use merge sort
    if n > 10:
        sorted_array = generate_large_sorted_array(n)
        print("First 10 elements after sorting:", list(sorted_array))
    else:
        sorted_array = generated_sorted_array(n)
        print("Sorted Array:", list(sorted_array))

    # Timing Linear Search
    start_time = time.perf_counter()
    linear_search_index = linear_search(sorted_array, target)
    end_time = time.perf_counter()
    linear_search_time = end_time - start_time

    # Timing Binary Search
    start_time = time.perf_counter()
    binary_search_index = binary_search(sorted_array, target)
    end_time = time.perf_counter()
    binary_search_time = end_time - start_time

    # Displaying the results
    if linear_search_index is not None:
        print(f"Linear Search: The target {target} is at index {linear_search_index}.")
    else:
        print("Linear Search: The target is not in the array.")
    print(f"Linear Search Time elapsed: {linear_search_time:.6f} seconds")

    if binary_search_index is not None:
        print(f"Binary Search: The target {target} is at index {binary_search_index}.")
    else:
        print("Binary Search: The target is not in the array.")
    print(f"Binary Search Time elapsed: {binary_search_time:.6f} seconds")

if __name__ == "__main__":
    main()