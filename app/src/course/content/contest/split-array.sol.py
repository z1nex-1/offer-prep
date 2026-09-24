import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))

    def parts(limit):
        cnt, cur = 1, 0
        for x in a:
            if cur + x > limit:
                cnt += 1
                cur = x
            else:
                cur += x
        return cnt

    lo, hi = max(a), sum(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if parts(mid) <= k:
            hi = mid
        else:
            lo = mid + 1
    print(lo)


main()
