import sys
import heapq
from collections import defaultdict


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))
    lo, hi = [], []
    delayed = defaultdict(int)
    size_lo = size_hi = 0

    def prune(h, sign):
        while h and delayed[sign * h[0]]:
            delayed[sign * h[0]] -= 1
            heapq.heappop(h)

    def balance():
        nonlocal size_lo, size_hi
        if size_lo > size_hi + 1:
            heapq.heappush(hi, -heapq.heappop(lo))
            size_lo -= 1
            size_hi += 1
            prune(lo, -1)
        elif size_lo < size_hi:
            heapq.heappush(lo, -heapq.heappop(hi))
            size_hi -= 1
            size_lo += 1
            prune(hi, 1)

    def add(x):
        nonlocal size_lo, size_hi
        if not lo or x <= -lo[0]:
            heapq.heappush(lo, -x)
            size_lo += 1
        else:
            heapq.heappush(hi, x)
            size_hi += 1
        balance()

    def remove(x):
        nonlocal size_lo, size_hi
        delayed[x] += 1
        if x <= -lo[0]:
            size_lo -= 1
            if x == -lo[0]:
                prune(lo, -1)
        else:
            size_hi -= 1
            if hi and x == hi[0]:
                prune(hi, 1)
        balance()

    out = []
    for i, x in enumerate(a):
        add(x)
        if i >= k:
            remove(a[i - k])
        if i >= k - 1:
            out.append(-lo[0])
    print(' '.join(map(str, out)))


main()
