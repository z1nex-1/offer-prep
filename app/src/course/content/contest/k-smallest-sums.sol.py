import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, m, k = int(data[0]), int(data[1]), int(data[2])
    a = list(map(int, data[3:3 + n]))
    b = list(map(int, data[3 + n:3 + n + m]))
    heap = [(a[i] + b[0], i, 0) for i in range(min(n, k))]
    heapq.heapify(heap)
    out = []
    while len(out) < k:
        s, i, j = heapq.heappop(heap)
        out.append(s)
        if j + 1 < m:
            heapq.heappush(heap, (a[i] + b[j + 1], i, j + 1))
    print(' '.join(map(str, out)))


main()
