class BinarySearchTree:
    class Node:
        def __init__(self, value):
            self.value = value 
            self.parent = None 
            self.left = None 
            self.right = None 

    def __init__(self):
        self.root = None 

    def insert(self, value):
        node = self.Node(value)
        if self.root is None:
            self.root = node 
            return f"{value} added to tree"
        current = self.root 
        while current:
            if current.value == value:
                return f"{value} already in tree"
            elif current.value > value:
                if current.left is None:
                    current.left = node 
                    node.parent = current 
                    return f"{value} added to tree"
                current = current.left 
            else:
                if current.right is None:
                    current.right = node 
                    node.parent = current 
                    return f"{value} added to tree"
                current = current.right
        
    def delete(self, value):
        def _delete_helper(current):
            if current.left is None and current.right is None:
                if current.parent:
                    if current.parent.left == current:
                        current.parent.left = None 
                    else:
                        current.parent.right = None 
                    current.parent = None
                else:
                    self.root = None 
                return f"{value} removed from tree"
            elif current.left is None:
                if current.parent:
                    if current.parent.left == current:
                        current.parent.left = current.right 
                    else:
                        current.parent.right = current.right 
                    current.right.parent = current.parent
                else:
                    current.right.parent = None
                    self.root = current.right
                current.parent = None 
                current.right = None 
                return f"{value} removed from tree"
            elif current.right is None:
                if current.parent:
                    if current.parent.left == current:
                        current.parent.left = current.left 
                    else:
                        current.parent.right = current.left 
                    current.left.parent = current.parent 
                else:
                    current.left.parent = None
                    self.root = current.left
                current.parent = None
                current.left = None
                return f"{value} removed from tree"

        if self.root is None:
            return "Tree is empty"
        current = self.root 
        while current:
            if current.value == value:
                if current.left is not None and current.right is not None:  
                    temp = current.left 
                    while temp.right:
                        temp = temp.right
                    temp.value, current.value = current.value, temp.value 
                    return _delete_helper(temp)
                return _delete_helper(current)
            elif current.value > value:
                current = current.left 
            else:
                current = current.right
        return f"{value} not in tree"

    def search(self, value):
        if self.root is None:
            return "Tree is empty"
        current = self.root 
        while current:
            if current.value == value:
                return "True"
            elif current.value > value:
                current = current.left 
            else:
                current = current.right 
        return "False"

    def pre_order(self, node):
        if node:
            yield node.value
            yield from self.pre_order(node.left)
            yield from self.pre_order(node.right)

    def in_order(self, node):
        if node:
            yield from self.in_order(node.left)
            yield node.value
            yield from self.in_order(node.right)

    def post_order(self, node):
        if node:
            yield from self.post_order(node.left)
            yield from self.post_order(node.right)
            yield node.value

    def bst_to_dict(self, node):
        if node:
            return {
                "value": node.value,
                "parent": node.parent.value if node.parent else None,
                "left": self.bst_to_dict(node.left),
                "right": self.bst_to_dict(node.right)
            }