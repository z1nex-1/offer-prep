import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def reachable(a):
    far = 0
    for i, x in enumerate(a):
        if i > far:
            return False
        far = max(far, i + x)
    return True


def tests():
    random.seed(44)
    out = [fmt([2, 3, 1, 1, 4]), fmt([2, 3, 0, 1, 4]), fmt([0]), fmt([1, 1, 1, 1]), fmt([10, 0, 0, 0])]
    for n in (6, 15, 80):
        while True:
            a = [random.randint(0, 4) for _ in range(n)]
            if reachable(a):
                break
        out.append(fmt(a))
    out.append(fmt([1] * 50000))
    a = [random.randint(1, 6) for _ in range(50000)]
    out.append(fmt(a))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    n = len(a)
    INF = float('inf')
    dp = [INF] * n
    dp[0] = 0
    for i in range(n):
        for j in range(i + 1, min(n, i + a[i] + 1)):
            dp[j] = min(dp[j], dp[i] + 1)
    return dp[-1]
