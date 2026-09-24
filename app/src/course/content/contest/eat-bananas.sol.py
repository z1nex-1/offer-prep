import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, h = int(data[0]), int(data[1])
    piles = list(map(int, data[2:2 + n]))
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum((p + mid - 1) // mid for p in piles) <= h:
            hi = mid
        else:
            lo = mid + 1
    print(lo)


main()
