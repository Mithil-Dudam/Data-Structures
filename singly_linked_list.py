class Node:
    def __init__(self, value):
        self.data = value 
        self.next = None 

class SinglyLinkedList:
    def __init__(self):
        self.head = None 

    def insert(self, value, index=None):
        node = Node(value)
        if self.head is None:
            self.head = node 
            self.traverse()
            return 
        if index is None:   
            current = self.head 
            while current.next:
                current = current.next
            current.next = node 
            self.traverse()
            return  
        else:
            if index == 0:
                node.next = self.head 
                self.head = node 
                self.traverse()
                return  
            current = self.head 
            for _ in range(index-1):
                if current.next:
                    current = current.next 
                else:
                    return "Index out of range"
            
            node.next = current.next
            current.next = node 
            self.traverse()
            return 
            
    def delete(self, value):
        if self.head is None:
            return "List is empty"
        current = self.head 
        if current.data == value:
            self.head = current.next 
            current.next = None 
            self.traverse()
            return
        while current.next:
            if current.next.data == value:
                temp = current.next 
                current.next = temp.next 
                temp.next = None 
                self.traverse()
                return 
            current = current.next 
        return f"{value} is not in list"
            
    def delete_index(self, index):
        if self.head is None:
            return "List is empty"
        current = self.head 
        if index == 0:
            self.head = current.next 
            current.next = None 
            self.traverse()
            return 
        for _ in range(index-1):
            if current:
                current = current.next 
            else:
                return "Index out of range"
        temp = current.next 
        if temp:
            current.next = temp.next 
            temp.next = None 
            self.traverse()
            return
        else:
            return "Index out of range"

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
            print(f"{current.data}", end=" -> ")
            current = current.next 
        print()

sll = SinglyLinkedList()
# Insert elements at the end
sll.insert(10)
sll.insert(20)
sll.insert(30)

# Insert at the head
sll.insert(5, index=0)

# Insert at index 2
sll.insert(15, index=2)

# Traverse the list
sll.traverse()  # Output: 5 -> 10 -> 15 -> 20 -> 30 ->

# Check length
print("\nLength:", sll.length())  # Output: Length: 5

# Search for existing and non-existing values
print("Search 20:", sll.search(20))  # Output: True
print("Search 99:", sll.search(99))  # Output: False

# Delete by value (head, middle, tail, not found)
sll.delete(5)      # Delete head
sll.delete(20)     # Delete middle
sll.delete(30)     # Delete tail
sll.delete(99)     # Not in list

# Traverse after deletions
sll.traverse()  # Output: 10 -> 15 ->

# Delete by index
sll.delete_index(1)  # Deletes value at index 1 (should remove 15)
sll.traverse()  # Output: 10 ->

# Try deleting at out-of-range index
print(sll.delete_index(5))  # Output: Index out of range
# Check length after deletions
print("\nLength:", sll.length())  # Output: Length: 1