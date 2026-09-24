n = int(input())
lo, hi = 0, 10 ** 9
while lo < hi:
    mid = (lo + hi + 1) // 2
    if mid * mid <= n:
        lo = mid
    else:
        hi = mid - 1
print(lo)
