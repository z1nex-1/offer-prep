import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    lo, hi, out = [], [], []
    for x in data[1:n + 1]:
        heapq.heappush(lo, -int(x))
        heapq.heappush(hi, -heapq.heappop(lo))
        if len(hi) > len(lo):
            heapq.heappush(lo, -heapq.heappop(hi))
        out.append(-lo[0])
    print('\n'.join(map(str, out)))


main()
