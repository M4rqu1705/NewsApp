import pickle

class LRUcache:
    def __init__(self, capacity):
        self.storage = dict()
        self.age = dict()
        self.capacity = capacity
        self.amount = 0

    def get(self, key):
        if self.storage.get(key) is not None and self.age.get(key) is not None:
            # Add one to every entry's age
            for k in self.age.keys():
                self.age[k] += 1
            # Reset current entry's age
            self.age[key] = 0
            
            return self.storage[key]

        else:
            return None

    def put(self, key, value):
        # Add one to every entry's age
        for k in self.age.keys():
            self.age[k] += 1

        if self.storage.get(key) is None and self.age.get(key) is None:
            self.amount += 1

        # Add new entry
        self.age[key] = 0
        self.storage[key] = value

        # Remove oldest entry if necessary
        if self.amount > self.capacity:
            max_age = max(list(self.age.values()))
            max_age_key = [k for k in self.age.keys() if self.age[k] == max_age][0]

            del self.age[max_age_key]
            del self.storage[max_age_key]
            self.amount -= 1

    def save(self, filename):
        try:
            with open(filename, "wb") as fp:
                pickle.dump(self, fp)
            return
        except:
            return

    def load(self, filename):
        try:
            with open(filename, "rb") as fp:
                data = pickle.load(fp, encoding="latin1")
                try:
                    self.storage = data.storage
                    self.age = data.age
                    self.capacity = data.capacity
                    self.amount = data.amount
                except:
                    return
        except:
            return
