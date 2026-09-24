def tests():
    return [f'{n}\n' for n in (10, 1, 2, 3, 20, 100, 1000, 99999, 10**6, 123456789, 10**10, 99999999999, 10**11)]


def brute(inp):
    n = int(inp)
    if n > 10**6:
        return None
    return str(sum(n // i for i in range(1, n + 1)))
