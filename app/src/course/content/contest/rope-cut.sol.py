import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    ropes = list(map(int, data[2:2 + n]))
    lo, hi = 0, max(ropes)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if sum(r // mid for r in ropes) >= k:
            lo = mid
        else:
            hi = mid - 1
    print(lo)


main()
