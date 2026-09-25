import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    k = int(data[0])
    lists = []
    pos = 1
    for _ in range(k):
        m = int(data[pos])
        lists.append(list(map(int, data[pos + 1:pos + 1 + m])))
        pos += 1 + m
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    out = []
    while heap:
        x, i, j = heapq.heappop(heap)
        out.append(x)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    print(' '.join(map(str, out)))


main()
