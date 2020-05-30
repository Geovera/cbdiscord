import time

class TimedDict(dict):
    def __init__(self):
        self.__table = {}
    def set_key(self, key, value, timeout=1):
        # add timer to table
        self.__table[key] = time.time() + timeout;
        super(TimedDict, self).__setitem__(key, value);
    def __contains__(self, key):
        return (key in self.__table) and (time.time() < self.__table.get(key))
    def __iter__(self):
        for item in dict.__iter__(self):
            if time.time() < self.__table.get(item):
                yield item