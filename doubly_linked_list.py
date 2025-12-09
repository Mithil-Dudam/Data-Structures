class Node:
    def __init__(self, value):
        self.data = value 
        self.next = None 
        self.prev = None 

class DoublyLinkedList:
    def __init__(self):
        self.head = None 
    
    def insert(self, value, index=None):
        node = Node(value)
        if self.head is None:
            self.head = node 
            self.traverse()
            return 
        current = self.head 
        if index is None:
            while current.next:
                current = current.next 
            current.next = node 
            node.prev = current 
            self.traverse()
            return 
        else:
            if index == 0:
                node.next = self.head 
                self.head.prev = node
                self.head = node 
                self.traverse()
                return 
            for _ in range(index-1):
                if current.next:
                    current = current.next 
                else:
                    return "Index out of range"
            node.prev = current 
            if current.next:
                node.next = current.next 
                current.next.prev = node 
            current.next = node 
            self.traverse()
            return 

    def delete(self, value):
        if self.head is None:
            return "List is empty"
        current = self.head 
        if current.data == value:
            if current.next:
                current.next.prev = None 
            self.head = self.head.next
            current.next = None 
            self.traverse()
            return
        while current.next:
            if current.next.data == value:
                temp = current.next 
                current.next = temp.next 
                if temp.next:
                    temp.next.prev = current 
                temp.next = None 
                temp.prev = None 
                self.traverse()
                return 
            else:
                current = current.next 
        return f"{value} is not in list"

    def delete_index(self, index):
        if self.head is None:
            return "List is empty"
        current = self.head 
        if index == 0:
            if current.next:
                current.next.prev = None 
            self.head = self.head.next
            current.next = None 
            self.traverse()
            return 
        for _ in range(index-1):
            if current.next:
                current = current.next 
            else:
                return "Index out of range" 
        temp = current.next
        if temp:
            current.next = temp.next  
            if temp.next:
                temp.next.prev = current 
            temp.next = None 
            temp.prev = None 
            self.traverse()
            return 
        else:
            return "index out of range"

    def search(self, value):
        if self.head is None:
            return "List is empty"
        current = self.head 
        while current:
            if current.data == value:
                return True 
            else:
                current = current.next 
        return False 
    
    def length(self):
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
            return "List is empty"
        current = self.head 
        while current:
            print(f"{current.data}", end=" <-> ")
            current = current.next
        print()

dll = DoublyLinkedList()

# Insert elements at the end
dll.insert(10)
dll.insert(20)
dll.insert(30)

# Insert at the head
dll.insert(5, index=0)

# Insert at index 2
dll.insert(15, index=2)

# Traverse the list
dll.traverse()  # Expected: 5 <-> 10 <-> 15 <-> 20 <-> 30 <->

# Check length
print("Length:", dll.length())  # Expected: 5

# Search for existing and non-existing values
print("Search 20:", dll.search(20))  # Expected: True
print("Search 99:", dll.search(99))  # Expected: False

# Delete by value (head, middle, tail, not found)
dll.delete(5)      # Delete head
dll.delete(20)     # Delete middle
dll.delete(30)     # Delete tail
dll.delete(99)     # Not in list

# Traverse after deletions
dll.traverse()  # Expected: 10 <-> 15 <->

# Delete by index
dll.delete_index(1)  # Deletes value at index 1 (should remove 15)
dll.traverse()  # Expected: 10 <->

# Try deleting at out-of-range index
print(dll.delete_index(5))  # Expected: index out of range

# Check length after deletions
print("Length:", dll.length())  # Expected: 1

# Delete last remaining element
dll.delete(10)
dll.traverse()  # Expected: List is empty

# Try deleting from empty list
print(dll.delete(1))         # Expected: List is empty
print(dll.delete_index(0))   # Expected: List is empty