import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    x = sorted(map(int, data[2:2 + n]))

    def fits(d):
        cnt, last = 1, x[0]
        for p in x[1:]:
            if p - last >= d:
                cnt += 1
                last = p
                if cnt >= k:
                    return True
        return cnt >= k

    lo, hi = 0, x[-1] - x[0]
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if fits(mid):
            lo = mid
        else:
            hi = mid - 1
    print(lo)


main()
