def tests():
    return [f'{n}\n' for n in (5, 10, 0, 1, 2, 20, 100, 500, 1000, 1500, 1600, 1700, 2000, 2500, 2999, 3000)]


def brute(inp):
    n = int(inp)
    f = 1
    for i in range(2, n + 1):
        f *= i
    cnt = total = 0
    while True:
        f, r = divmod(f, 10)
        cnt += 1
        total += r
        if f == 0:
            break
    return f'{cnt} {total}'
