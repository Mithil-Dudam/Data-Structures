class Node:
    def __init__(self, value):
        self.data = value 
        self.next = None 

class Queue:
    def __init__(self):
        self.head = None 
        self.tail = None 
    
    def enqueue(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node 
            self.tail = node 
            return 
        self.tail.next = node 
        self.tail = node 
        return  
    
    def dequeue(self):
        if self.head is None:
            return "Queue is empty"
        temp = self.head 
        self.head = self.head.next 
        temp.next = None 
        if self.head is None:
            self.tail = None
        return temp.data 
    
    def peek(self):
        if self.head is None:
            return "Queue is empty"
        return self.head.data 
    
    def is_empty(self):
        return self.head is None 

    def size(self):
        if self.head is None:
            return 0 
        len=0
        current = self.head 
        while current:
            len += 1
            current = current.next 
        return len 
    
    def traverse(self):
        if self.head is None:
            return "Queue is empty" 
        current = self.head 
        while current:
            print(f"{current.data}", end=", ")
            current = current.next 
        print()

q = Queue()

# Enqueue elements
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
q.traverse()  # Expected: 10, 20, 30,

# Check size
print("Size:", q.size())  # Expected: 3

# Peek at the front
print("Peek:", q.peek())  # Expected: 10

# Dequeue elements
print("Dequeued:", q.dequeue())  # Expected: 10
q.traverse()  # Expected: 20, 30,

print("Dequeued:", q.dequeue())  # Expected: 20
print("Dequeued:", q.dequeue())  # Expected: 30

# Try to dequeue from empty queue
print("Dequeued:", q.dequeue())  # Expected: Queue is empty

# Check if queue is empty
print("Is empty:", q.is_empty())  # Expected: True

# Enqueue after emptying
q.enqueue(40)
q.traverse()  # Expected: 40,

# Check size again
print("Size:", q.size())  # Expected: 1

# Peek after re-enqueue
print("Peek:", q.peek())  # Expected: 40