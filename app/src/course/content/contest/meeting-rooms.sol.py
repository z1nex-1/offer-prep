import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    meet = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
    ends = []
    for s, e in meet:
        if ends and ends[0] <= s:
            heapq.heapreplace(ends, e)
        else:
            heapq.heappush(ends, e)
    print(len(ends))


main()
