class Heap:
    def __init__(self):
        self.max_heap = []
        self.min_heap = []

    def insert(self, value):
        self.max_heap.append(value)
        self.min_heap.append(value)

        if len(self.max_heap) != 1:
            index = len(self.max_heap) - 1
            while index > 0:
                parent = (index - 1) // 2
                if self.max_heap[parent] < self.max_heap[index]:
                    self.max_heap[parent], self.max_heap[index] = self.max_heap[index], self.max_heap[parent]
                    index = parent
                else:
                    break

            index = len(self.min_heap) - 1
            while index > 0:
                parent = (index - 1) // 2
                if self.min_heap[parent] > self.min_heap[index]:
                    self.min_heap[parent], self.min_heap[index] = self.min_heap[index], self.min_heap[parent]
                    index = parent
                else:
                    break
        return f"{value} added to heap"

    def extract(self):
        if not self.max_heap:
            return "Heap is empty"
        
        if len(self.max_heap) == 1:
            max_element = self.max_heap.pop()
            min_element = self.min_heap.pop()
        else:
            self.max_heap[0], self.max_heap[-1] = self.max_heap[-1], self.max_heap[0]
            max_element = self.max_heap.pop()
            self.min_heap[0], self.min_heap[-1] = self.min_heap[-1], self.min_heap[0]
            min_element = self.min_heap.pop()

            index = 0
            while index < len(self.max_heap):
                left = 2 * index + 1
                right = 2 * index + 2
                largest = index 
                if left < len(self.max_heap) and self.max_heap[largest] < self.max_heap[left]:
                    largest = left 
                if right < len(self.max_heap) and self.max_heap[largest] < self.max_heap[right]:
                    largest = right 
                if largest == index:
                    break
                self.max_heap[index], self.max_heap[largest] = self.max_heap[largest], self.max_heap[index]
                index = largest

            index = 0
            while index < len(self.min_heap):
                left = 2 * index + 1
                right = 2 * index + 2
                smallest = index 
                if left < len(self.min_heap) and self.min_heap[smallest] > self.min_heap[left]:
                    smallest = left 
                if right < len(self.min_heap) and self.min_heap[smallest] > self.min_heap[right]:
                    smallest = right 
                if smallest == index:
                    break
                self.min_heap[index], self.min_heap[smallest] = self.min_heap[smallest], self.min_heap[index]
                index = smallest

        return (max_element, min_element)

    def heapify(self, nums):
        temp = nums.copy()

        parent = (len(nums) - 2) // 2 
        for i in range(parent, -1, -1):
            index = i 
            while index < len(nums):
                left = 2 * index + 1
                right = 2 * index + 2 
                largest = index 
                if left < len(nums) and nums[largest] < nums[left]:
                    largest = left 
                if right < len(nums) and nums[largest] < nums[right]:
                    largest = right 
                if largest == index:
                    break 
                nums[index], nums[largest] = nums[largest], nums[index]
                index = largest

        parent = (len(temp) - 2) // 2 
        for i in range(parent, -1, -1):
            index = i 
            while index < len(temp):
                left = 2 * index + 1
                right = 2 * index + 2 
                smallest = index 
                if left < len(temp) and temp[smallest] > temp[left]:
                    smallest = left 
                if right < len(temp) and temp[smallest] > temp[right]:
                    smallest = right 
                if smallest == index:
                    break 
                temp[index], temp[smallest] = temp[smallest], temp[index]
                index = smallest

        return (nums, temp)

    def peek(self):
        if not self.max_heap:
            return "Heap is empty"
        return (self.max_heap[0], self.min_heap[0])
        