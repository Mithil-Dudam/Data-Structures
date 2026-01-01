import time
import threading 
import json

class MiniRedis:
    def __init__(self):
        self.storage = {}
        self.lock = threading.Lock()

    def startup(self):
        try:
            with open("storage.json", "r") as f:
                self.storage = json.load(f)
        except(json.decoder.JSONDecodeError, FileNotFoundError):
            self.storage={}
    
    def set(self, key, value, ttl=None):
        with self.lock:
            if key in self.storage: 
                if ttl is None:
                    self.storage[key] = [value, None]
                    return "\nToken updated\n"
                if  ttl > 0:
                    self.storage[key] = [value, time.time() + ttl]
                    return "\nToken updated\n"
                else:
                    return "\nInvalid ttl\n"
            else:
                if ttl is None:
                    self.storage[key] = [value, ttl]
                    return "\nToken added\n"
                if ttl > 0:
                    self.storage[key] = [value, time.time() + ttl]
                    return "\nToken added\n"
                else:
                    return "\nInvalid ttl\n"

    def get(self, key):
        with self.lock:
            if key in self.storage:
                value, expiry = self.storage[key][0], self.storage[key][1]
                if expiry is None:
                    return value 
                if expiry > time.time():
                    return value 
                del self.storage[key]
                return "\nKey not found\n"
            return "\nKey not found\n"
    
    def delete(self, key):
        with self.lock:
            if key in self.storage:
                expiry = self.storage[key][1]
                if expiry is not None and expiry <= time.time():
                    del self.storage[key]
                    return "\nKey not found\n"
                del self.storage[key]
                return f"\n{key} deleted successfully\n"
            return "\nKey not found\n"

    def exists(self, key):
        with self.lock:
            if key in self.storage:
                expiry = self.storage[key][1]
                if expiry is not None and expiry <= time.time():
                    del self.storage[key]
                    return False 
                return True 
            return False 

    def get_keys(self):
        with self.lock:
            keys = []
            for k, v in self.storage.items():
                if v[1] is None or v[1] > time.time():
                    keys.append(k) 
            return ", ".join(keys)

    def active_cleanup(self):
        with self.lock:
            keys = list(self.storage.keys())
            for key in keys:
                expiry = self.storage[key][1]
                if expiry is not None and expiry <= time.time():
                    del self.storage[key]
    
    def list_all(self):
        with self.lock:
            for k, v in self.storage.items():
                print(f"{k}: {v}")

    def persist(self):
        with self.lock:
            with open("storage.json", "w") as f:
                json.dump(self.storage, f)


def cleanup(mini_redis):
    while True:
        print("="*60)
        print("Cleanup Starting ...")
        mini_redis.active_cleanup()
        print("Cleanup Over!\n")
        time.sleep(60)

def list_everything(mini_redis):
    while True:
        print("="*60)
        mini_redis.list_all()
        print()
        time.sleep(10)

def persist_storage(mini_redis):
    while True:
        print("="*60)
        print("Saving Data ...")
        mini_redis.persist()
        print("Data Saved!\n")
        time.sleep(120)


mini_redis = MiniRedis()
mini_redis.startup()
t1 = threading.Thread(target=cleanup, args=(mini_redis, ), daemon=True)
t2 = threading.Thread(target=list_everything, args=(mini_redis, ), daemon=True)
t3 = threading.Thread(target=persist_storage, args=(mini_redis, ), daemon=True)
t1.start()
t2.start()
t3.start()

while True:
    print("1 - set token")
    print("2 - get token")
    print("3 - delete token")
    print("4 - check if token exists")
    print("5 - get all tokens")

    try:
        user_input = int(input("Enter choice: "))
    except ValueError:
        print("\nError: Invalid input. Please enter a number between 1 and 5.\n")
        continue
    match user_input:
        case 1:
            key = input("Enter Key: ")
            value = input("Enter Value: ")
            try:
                ttl = input("Enter ttl (Optional): ")
            except ValueError:
                ttl = None
            if ttl:
                ttl = int(ttl)
            else:
                ttl = None 
            result = mini_redis.set(key, value, ttl)
            print(result)
        
        case 2:
            key = input("Enter Key: ")
            result = mini_redis.get(key)
            print(result)

        case 3:
            key = input("Enter Key: ")
            result = mini_redis.delete(key)
            print(result)

        case 4:
            key = input("Enter Key: ")
            result = mini_redis.exists(key)
            print(result)

        case 5:
            result = mini_redis.get_keys()
            print(result)

        case _:
            print("\nError: Invalid choice. Please enter a number between 1 and 5.\n")
