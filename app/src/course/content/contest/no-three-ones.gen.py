def tests():
    return [f'{n}\n' for n in (3, 1, 2, 4, 5, 10, 18, 1000, 123456, 1000000)]


def brute(inp):
    n = int(inp)
    if n > 18:
        return None
    return sum(1 for m in range(1 << n) if '111' not in format(m, f'0{n}b'))
