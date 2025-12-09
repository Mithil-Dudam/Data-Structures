class MaxHeap:
    def __init__(self):
        self.heap = []

    def insert(self, value):
        self.heap.append(value)
        index = len(self.heap)-1 
        while index > 0:
            parent_index = (index-1) // 2
            if self.heap[index] > self.heap[parent_index]:
                self.heap[index], self.heap[parent_index] = self.heap[parent_index], self.heap[index]
                index = parent_index 
            else:
                break
        return self.heap
    
    def extract(self):
        if not self.heap:
            return "Heap is empty"
        if len(self.heap) == 1:
            return self.heap.pop()
        max_val = self.heap[0]
        self.heap[0], self.heap[-1] = self.heap[-1], self.heap[0]
        self.heap.pop()
        index = 0
        while True:
            left = 2*index + 1
            right = 2*index + 2
            largest = index 

            if left < len(self.heap) and self.heap[left] > self.heap[largest]:
                largest = left 
            if right < len(self.heap) and self.heap[right] > self.heap[largest]:
                largest = right 
            if largest == index:
                break 
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            index = largest 
        print(self.heap)
        return max_val 


    def heapify(self, nums):
        parent = (len(nums)-2) // 2
        for i in range(parent, -1, -1):
            index = i
            while True:
                left = 2*index + 1
                right = 2*index + 2
                largest = index
                if left < len(nums) and nums[left] > nums[largest]:
                    largest = left
                if right < len(nums) and nums[right] > nums[largest]:
                    largest = right 
                if largest == index:
                    break
                nums[index], nums[largest] = nums[largest], nums[index]
                index = largest
        return nums

    def peek(self):
        if not self.heap:
            return "Heap is empty"
        return self.heap[0]
    
h = MaxHeap()
h.insert(10)
h.insert(20)
h.insert(5)
h.insert(30)
print("Heap after inserts:", h.heap)

max_val = h.extract()
print("Extracted max:", max_val)
print("Heap after extract:", h.heap)

peek_val = h.peek()
print("Peek max:", peek_val)

# Test heapify on a list
nums = [3, 1, 6, 5, 2, 4]
h.heapify(nums)
print("Heapified list:", nums)