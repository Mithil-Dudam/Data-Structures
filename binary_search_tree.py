class Node:
    def __init__(self, value):
        self.data = value 
        self.parent = None 
        self.left = None 
        self.right = None 

class BinarySearchTree:
    def __init__(self):
        self.root = None 
    
    def insert(self, value):
        node = Node(value)
        if self.root is None:
            self.root = node 
            return 
        current = self.root 
        while current:
            if current.data > value:
                if current.left is None:
                    current.left = node 
                    node.parent = current 
                    return 
                else:
                    current = current.left
            else:
                if current.right is None:   
                    current.right = node 
                    node.parent = current
                    return 
                else:
                    current = current.right 

    def delete(self, value):
        if self.root is None:
            return "Tree is empty"
        current = self.root 
        while current:
            if current.data == value:
                if current.left is not None and current.right is not None:
                    temp = current.left 
                    while temp.right:
                        temp = temp.right 
                    current.data, temp.data = temp.data, current.data 
                    self.helper_func(temp) 
                    return
                else:
                    self.helper_func(current)
                    return 
            elif current.data > value:
                current = current.left 
            else:
                current = current.right 

        return f"{value} is not in tree"

    def helper_func(self, current):
        if current.left is None and current.right is None:
            if current.parent:
                if current.parent.left == current:
                    current.parent.left = None 
                else:
                    current.parent.right = None 
            else:
                self.root = None 
                return
            current.parent = None 
            return 
        
        elif current.left is None:
            if current.parent:
                if current.parent.left == current:
                    current.parent.left = current.right 
                else:
                    current.parent.right = current.right 
            else:
                self.root = current.right 
                current.right.parent = None 
                current.right = None
                return
            current.right.parent = current.parent
            return

        elif current.right is None:
            if current.parent:
                if current.parent.left == current:
                    current.parent.left = current.left 
                else:
                    current.parent.right = current.left 
            else:
                self.root = current.left 
                current.left.parent = None 
                current.left = None 
                return
            current.left.parent = current.parent 
            return 
            
    def search(self, value):
        if self.root is None:
            return "Tree is empty"
        current = self.root 
        while current:
            if current.data == value:
                return True 
            elif current.data > value:
                current = current.left 
            else:
                current = current.right 
        return False

    def in_order(self, node):
        if node:
            yield from self.in_order(node.left)
            yield node.data 
            yield from self.in_order(node.right)

    def pre_order(self, node):
        if node:
            yield node.data 
            yield from self.pre_order(node.left)
            yield from self.pre_order(node.right)

    def post_order(self, node):
        if node:
            yield from self.post_order(node.left)
            yield from self.post_order(node.right)
            yield node.data 
            
bst = BinarySearchTree()

# Insert elements
bst.insert(50)
bst.insert(30)
bst.insert(70)
bst.insert(20)
bst.insert(40)
bst.insert(60)
bst.insert(80)

# Inorder traversal (should be sorted)
print("Inorder:", list(bst.in_order(bst.root)))  # [20, 30, 40, 50, 60, 70, 80]

# Preorder traversal
print("Preorder:", list(bst.pre_order(bst.root)))  # [50, 30, 20, 40, 70, 60, 80]

# Postorder traversal
print("Postorder:", list(bst.post_order(bst.root)))  # [20, 40, 30, 60, 80, 70, 50]

# Search for existing and non-existing values
print("Search 60:", bst.search(60))  # True
print("Search 100:", bst.search(100))  # False

# Delete leaf node
bst.delete(20)
print("After deleting 20 (leaf):", list(bst.in_order(bst.root)))  # [30, 40, 50, 60, 70, 80]

# Delete node with one child
bst.delete(30)
print("After deleting 30 (one child):", list(bst.in_order(bst.root)))  # [40, 50, 60, 70, 80]

# Delete node with two children
bst.delete(70)
print("After deleting 70 (two children):", list(bst.in_order(bst.root)))  # [40, 50, 60, 80]

# Delete root node
bst.delete(50)
print("After deleting 50 (root):", list(bst.in_order(bst.root)))  # [40, 60, 80]

# Try deleting a value not in the tree
print(bst.delete(999))  # "999 is not in tree"

# Try searching in an empty tree
empty_bst = BinarySearchTree()
print(empty_bst.search(1))  # "Tree is empty"