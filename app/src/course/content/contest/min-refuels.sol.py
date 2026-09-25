import heapq
import sys

data = sys.stdin.buffer.read().split()
T, reach, n = int(data[0]), int(data[1]), int(data[2])
st = sorted(zip(map(int, data[3:3 + 2 * n:2]), map(int, data[4:4 + 2 * n:2])))
heap, stops, i = [], 0, 0
while reach < T:
    while i < n and st[i][0] <= reach:
        heapq.heappush(heap, -st[i][1])
        i += 1
    if not heap:
        stops = -1
        break
    reach -= heapq.heappop(heap)
    stops += 1
print(stops)
