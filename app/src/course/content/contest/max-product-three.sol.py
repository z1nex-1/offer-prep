import sys
import heapq


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1:n + 1]))
    top = heapq.nlargest(3, a)
    low = heapq.nsmallest(2, a)
    print(max(top[0] * top[1] * top[2], low[0] * low[1] * top[0]))


main()
