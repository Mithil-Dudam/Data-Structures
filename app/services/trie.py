class Trie:
    class Node:
        def __init__(self):
            self.children = dict()
            self.is_end_of_word = False 

    def __init__(self):
        self.root = self.Node()
    
    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = self.Node()
            current = current.children[char]
        current.is_end_of_word = True
        return f"{word} added to trie"

    def delete(self, word):
        deleted = [False]
        def _delete(node, word, depth):
            if depth == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False
                deleted[0] = True
                return len(node.children) == 0 
            char = word[depth]
            if char not in node.children:
                return False
            delete_child = _delete(node.children[char], word, depth + 1)
            if delete_child:
                del node.children[char]
                return (len(node.children) == 0) and (not node.is_end_of_word)
            return False 
        _delete(self.root, word, 0)
        return f"{word} deleted from trie" if deleted[0] else f"{word} not in trie"

    def search(self, word):
        current = self.root 
        for char in word:
            if char not in current.children:
                return "False"
            current = current.children[char]
        if current.is_end_of_word:
            return "True"
        return "False"
    
    def has_prefix(self, prefix):
        current = self.root 
        for char in prefix:
            if char not in current.children:
                return "False"
            current = current.children[char]
        return "True"

    def starts_with(self, prefix):
        words = []
        current = self.root 
        for char in prefix:
            if char not in current.children:
                return words
            current = current.children[char]

        def _dfs(node, prefix):
            if node.is_end_of_word:
                words.append(prefix)
            for char, child in node.children.items():
                _dfs(child, prefix + char)
        _dfs(current, prefix)

        return words

    def list_words(self):
        words = []
        def _dfs(node, path):
            if node.is_end_of_word:
                words.append(path)
            for char, child in node.children.items():
                _dfs(child, path + char)
        _dfs(self.root, "")
        return words

    def trie_to_dict(self, node, char=""):
        if node:
            return {
                "char": char,
                "is_end_of_word": node.is_end_of_word,
                "children": [self.trie_to_dict(child, c) for c, child in node.children.items()]
            }