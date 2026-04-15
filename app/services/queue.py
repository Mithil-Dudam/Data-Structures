class Node:
    def __init__(self, value):
        self.value = value 
        self.next = None 

class Queue:
    def __init__(self):
        self.head = None 
        self.tail = None 
        self.size = 0

    def enqueue(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node 
            self.tail = node 
            self.size += 1
            return f"{value} enqueued to queue"
        self.tail.next = node 
        self.tail = node 
        self.size += 1
        return f"{value} enqueued to queue"
    
    def dequeue(self):
        if self.head is None:
            return "Queue underflow"
        current = self.head 
        self.head = current.next
        current.next = None
        if self.head is None:
            self.tail = None 
        self.size -= 1
        return f"{current.value} dequeued from queue"
    
    def peek(self):
        if self.head is None:
            return "Queue is empty"
        return f"{self.head.value} is at the front of the queue"
    
    def is_empty(self):
        return self.head is None 
    
    def length(self):
        return self.size 
    
    def traverse(self):
        elements = []
        current = self.head 
        while current:
            elements.append(current.value)
            current = current.next 
        return elements