class SinglyLinkedList:
    class Node:
        def __init__(self, value):
            self.value = value 
            self.next = None

    def __init__(self):
        self.head = None 
        self.size = 0

    def insert(self, value, index=None):
        node = self.Node(value)
        if self.head is None or index == 0:
            node.next = self.head
            self.head = node
            self.size += 1
            return f"{value} inserted at head"
        current = self.head 
        if index is None:
            while current.next:
                current = current.next 
            current.next = node 
            self.size += 1
            return f"{value} inserted to list"
        for _ in range(index-1):
            if current.next:
                current = current.next 
            else:
                return "Index out of bounds"
        node.next = current.next 
        current.next = node
        self.size += 1
        return f"{value} inserted at index {index}"
    
    def delete(self, value):
        if self.head is None:
            return "List is empty"
        current = self.head 
        if current.value == value:
            self.head = current.next 
            current.next = None 
            self.size -= 1
            return f"{value} deleted from list"
        while current.next:
            if current.next.value == value:
                temp = current.next
                current.next = temp.next
                temp.next = None
                self.size -= 1
                return f"{value} deleted from list"
            current = current.next 
        return f"{value} not in list"
    
    def delete_index(self, index):
        if self.head is None:
            return "List is empty"
        current = self.head
        if index == 0:
            self.head = current.next 
            current.next = None
            self.size -= 1
            return f"Deleted element at index {index}"
        for _ in range(index-1):
            if current.next:
                current = current.next 
            else:
                return "Index out of bounds"
        temp = current.next
        if temp is None:
            return "Index out of bounds"
        current.next = temp.next
        temp.next = None
        self.size -= 1
        return f"Deleted element at index {index}"
    
    def search(self, value):
        if self.head is None:
            return "List is empty"
        current = self.head
        while current:
            if current.value == value:
                return "True"
            current = current.next
        return "False"
    
    def length(self):
        return self.size
    
    def traverse(self):
        elements = []
        current = self.head 
        while current:
            elements.append(current.value)
            current = current.next 
        return elements