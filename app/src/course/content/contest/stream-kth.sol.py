import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    h, out = [], []
    for x in data[2:2 + n]:
        x = int(x)
        if len(h) < k:
            heapq.heappush(h, x)
        elif x > h[0]:
            heapq.heapreplace(h, x)
        out.append(h[0] if len(h) == k else -1)
    print('\n'.join(map(str, out)))


main()
