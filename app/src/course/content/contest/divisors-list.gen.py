def tests():
    return [f'{n}\n' for n in (12, 36, 1, 2, 97, 100, 1024, 720720, 999999937, 10**12, 999999999989, 963761198400, 999966000289, 2**39, 735134400)]


def brute(inp):
    n = int(inp)
    if n > 10**7:
        return None
    res = [d for d in range(1, n + 1) if n % d == 0]
    return f'{len(res)}\n' + ' '.join(map(str, res))
