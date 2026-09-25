import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))

    def exists(m):
        prev = [0.0] * (n + 1)
        cur = 0.0
        best_left = float("inf")
        for i in range(1, n + 1):
            cur += a[i - 1] - m
            prev[i] = cur
            if i >= k:
                if prev[i - k] < best_left:
                    best_left = prev[i - k]
                if cur - best_left >= 0:
                    return True
        return False

    lo, hi = float(min(a)), float(max(a))
    for _ in range(50):
        mid = (lo + hi) / 2
        if exists(mid):
            lo = mid
        else:
            hi = mid
    print(f"{lo:.7f}")


main()
