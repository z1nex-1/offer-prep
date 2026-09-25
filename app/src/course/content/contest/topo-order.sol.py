import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    g = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)
    for i in range(m):
        a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        g[a].append(b)
        indeg[b] += 1
    heap = [v for v in range(1, n + 1) if indeg[v] == 0]
    heapq.heapify(heap)
    order = []
    while heap:
        u = heapq.heappop(heap)
        order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(heap, v)
    print(' '.join(map(str, order)) if len(order) == n else -1)


main()
