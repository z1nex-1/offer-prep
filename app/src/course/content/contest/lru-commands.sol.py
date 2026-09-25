import sys
from collections import OrderedDict


def main():
    lines = sys.stdin.buffer.read().split(b'\n')
    c, q = map(int, lines[0].split())
    cache = OrderedDict()
    out = []
    for line in lines[1:q + 1]:
        p = line.split()
        if p[0] == b'GET':
            k = int(p[1])
            if k in cache:
                cache.move_to_end(k)
                out.append(str(cache[k]))
            else:
                out.append('-1')
        else:
            k, v = int(p[1]), int(p[2])
            if k in cache:
                cache.move_to_end(k)
            cache[k] = v
            if len(cache) > c:
                cache.popitem(last=False)
    print('\n'.join(out))


main()
