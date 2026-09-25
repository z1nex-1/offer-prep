import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    free = list(range(n))
    busy = []
    out = []
    for i in range(m):
        t, d = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        while busy and busy[0][0] <= t:
            _, s = heapq.heappop(busy)
            heapq.heappush(free, s)
        if free:
            s = heapq.heappop(free)
            end = t + d
        else:
            start, s = heapq.heappop(busy)
            end = start + d
        heapq.heappush(busy, (end, s))
        out.append(f'{s} {end}')
    print('\n'.join(out))


main()
