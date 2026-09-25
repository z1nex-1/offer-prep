import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    pts = [(int(data[2 + 2 * i]), int(data[3 + 2 * i])) for i in range(n)]
    best = heapq.nsmallest(k, pts, key=lambda p: (p[0] * p[0] + p[1] * p[1], p[0], p[1]))
    print('\n'.join(f'{x} {y}' for x, y in best))


main()
