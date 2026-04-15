class Node:
    def __init__(self, value):
        self.value = value 
        self.next = None 

class Stack:
    def __init__(self):
        self.head = None 
        self.size = 0

    def push(self, value):
        node = Node(value)
        node.next = self.head 
        self.head = node 
        self.size += 1
        return f"{value} pushed to stack"
    
    def pop(self):
        if self.is_empty():
            return "Stack underflow"
        current = self.head 
        self.head = current.next 
        current.next = None 
        self.size -= 1
        return f"{current.value} popped from stack"
    
    def peek(self):
        if self.is_empty():
            return "Stack is empty"
        return f"{self.head.value} is on top of the stack"
    
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