class Node:
    def __init__(self, value):
        self.data = value 
        self.next = None 

class Stack:
    def __init__(self):
        self.head = None 

    def push(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node 
            return 
        node.next = self.head 
        self.head = node 
        return 

    def pop(self):
        if self.head is None:
            return "Stack is empty"
        current = self.head 
        self.head = self.head.next 
        current.next = None 
        return current.data 

    def peek(self):
        if self.head is None:
            return "Stack is empty"
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
            return "Stack is empty" 
        current = self.head 
        while current:
            print(f"{current.data}", end=", ")
            current = current.next 
        print()
        
s = Stack()

# Push elements onto the stack
s.push(10)
s.push(20)
s.push(30)
s.traverse()  # Expected: 30, 20, 10,

# Check size
print("Size:", s.size())  # Expected: 3

# Peek at the top
print("Peek:", s.peek())  # Expected: 30

# Pop elements
print("Popped:", s.pop())  # Expected: 30
s.traverse()  # Expected: 20, 10,

print("Popped:", s.pop())  # Expected: 20
print("Popped:", s.pop())  # Expected: 10

# Try to pop from empty stack
print("Popped:", s.pop())  # Expected: Stack is empty

# Check if stack is empty
print("Is empty:", s.is_empty())  # Expected: True

# Push after emptying
s.push(40)
s.traverse()  # Expected: 40,

# Check size again
print("Size:", s.size())  # Expected: 1

# Peek after re-push
print("Peek:", s.peek())  # Expected: 40