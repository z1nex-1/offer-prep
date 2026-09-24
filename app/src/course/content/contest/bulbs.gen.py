def tests():
    ns = [10, 3, 1, 2, 4, 8, 9, 15, 16, 17, 100, 1000, 12345, 10**6, 10**18, 10**18 - 1, 999999999999999999, 999999998000000001, 999999998000000000,
          4 * 10**17, 123456789012345678]
    return [f'{n}\n' for n in ns]


def brute(inp):
    n = int(inp)
    if n > 20000:
        return None
    on = [False] * (n + 1)
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            on[j] = not on[j]
    return str(sum(on))
