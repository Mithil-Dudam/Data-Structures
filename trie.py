class Node:
    def __init__(self):
        self.children = dict()
        self.is_end_of_word = False 

class Trie:
    def __init__(self):
        self.root = Node()

    def insert(self, word):
        current = self.root 
        for char in word:
            if char not in current.children:
                current.children[char] = Node()
            current = current.children[char]
        current.is_end_of_word = True

    def delete(self, word):
        def _delete(node, word, depth):
            if depth == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False 
                return len(node.children) == 0
            char = word[depth]
            if char not in node.children:
                return False
            should_delete_child = _delete(node.children[char], word, depth + 1)
            if should_delete_child:
                del node.children[char]
                return (not node.is_end_of_word) and len(node.children) == 0
            return False 
        _delete(self.root, word, 0)
        
    def search(self, word):
        current = self.root 
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        if not current.is_end_of_word:
            return False
        return True

    def has_prefix(self, prefix):
        current = self.root 
        for char in prefix:
            if char not in current.children:
                return False 
            current = current.children[char]
        return True 

    def starts_with(self, prefix):
        words = []
        current = self.root 
        for char in prefix:
            if char not in current.children:
                return words 
            current = current.children[char]
        def dfs(node, path):
            if node.is_end_of_word:
                words.append(prefix+path)
            for char, child in node.children.items():
                dfs(child, path + char)
        dfs(current, "")
        return words
    
    def list_words(self):
        words = []
        def dfs(node, path):
            if node.is_end_of_word:
                words.append(path)
            for char, child in node.children.items():
                dfs(child, path + char)
        dfs(self.root, "")
        return words

trie = Trie()

# Insert words
trie.insert("cat")
trie.insert("car")
trie.insert("dog")
trie.insert("cart")
trie.insert("do")

# List all words
print("All words:", trie.list_words())  # ['cat', 'car', 'cart', 'dog', 'do']

# Search for words
print("Search 'cat':", trie.search("cat"))    # True
print("Search 'can':", trie.search("can"))    # False

# Has prefix
print("Has prefix 'ca':", trie.has_prefix("ca"))  # True
print("Has prefix 'do':", trie.has_prefix("do"))  # True
print("Has prefix 'z':", trie.has_prefix("z"))    # False

# Starts with
print("Words starting with 'ca':", trie.starts_with("ca"))  # ['cat', 'car', 'cart']
print("Words starting with 'do':", trie.starts_with("do"))  # ['dog', 'do']

# Delete a word
trie.delete("car")
print("All words after deleting 'car':", trie.list_words())  # ['cat', 'cart', 'dog', 'do']

# Delete a word that doesn't exist
trie.delete("can")  # Should not affect the Trie
print("All words after deleting 'can':", trie.list_words())  # ['cat', 'cart', 'dog', 'do']