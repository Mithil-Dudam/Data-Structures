class HashMap:
    def __init__(self, capacity):
        self.capacity = capacity 
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def length(self):
        return self.size 

    def contains(self, key):
        index = self._hash_function(key)
        bucket = self.buckets[index]
        for k, v in bucket:
            if k == key:
                return True
        return False

    def put(self, key, value):
        index = self._hash_function(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return 
        bucket.append((key, value))
        self.size += 1

    def get(self, key):
        index = self._hash_function(key)
        bucket = self.buckets[index]
        for k, v in bucket:
            if k == key:
                return v 
        return "Key not found"

    def remove(self, key):
        index = self._hash_function(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self.size -= 1
                return
        return "Key not found"
    
    def keys(self):
        return [k for bucket in self.buckets for k, _ in bucket]
    
    def values(self):
        return [v for bucket in self.buckets for _, v in bucket]
    
    def items(self):
        return [(k, v) for bucket in self.buckets for k, v in bucket]
    
    def _hash_function(self, key):
        key_string = str(key)
        hash_result = 0 
        for char in key_string:
            hash_result = (hash_result * 31 + ord(char)) % self.capacity
        return hash_result

hm = HashMap(10)
hm.put("a", 1)
hm.put("b", 2)
hm.put("c", 3)

print(hm.get("a"))        # Output: 1
print(hm.get("b"))        # Output: 2
print(hm.get("z"))        # Output: Key not found

print(hm.contains("a"))   # Output: True
print(hm.contains("z"))   # Output: False

hm.remove("b")
print(hm.get("b"))        # Output: Key not found

print(hm.keys())          # Output: ['a', 'c']
print(hm.values())        # Output: [1, 3]
print(hm.items())         # Output: [('a', 1), ('c', 3)]

print(hm.length())        # Output: 2