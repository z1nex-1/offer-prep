import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(124)
    out = [fmt([10, 9, 2, 5, 3, 7, 101, 18]), fmt([7, 7, 7]), fmt([1]), fmt([5, 4, 3, 2, 1]), fmt([1, 2, 3])]
    for n in (8, 40, 300):
        out.append(fmt([random.randint(-20, 20) for _ in range(n)]))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)]))
    out.append(fmt(list(range(40000))))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    if len(a) > 400:
        return None
    dp = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
