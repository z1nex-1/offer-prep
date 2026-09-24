def tests():
    cases = [(12, 2), (100, 9), (1, 1), (1, 2), (2, 2), (30, 4), (1000, 8), (2000, 1000), (5040, 60), (100000, 2), (720720, 240),
             (1000000, 2), (1000000, 4), (1000000, 16), (1000000, 240), (999999, 3), (1000000, 1000), (1000000, 1)]
    return [f'{n} {t}\n' for n, t in cases]


def brute(inp):
    n, t = map(int, inp.split())
    if n > 2000:
        return None
    return str(sum(1 for k in range(1, n + 1) if sum(1 for d in range(1, k + 1) if k % d == 0) == t))
