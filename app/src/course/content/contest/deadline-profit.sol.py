import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    jobs = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
    heap = []
    for d, p in jobs:
        heapq.heappush(heap, p)
        if len(heap) > d:
            heapq.heappop(heap)
    print(sum(heap))


main()
