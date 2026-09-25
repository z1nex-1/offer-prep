import random


def tests():
    random.seed(111)
    out = ['5 3\n4 5 8 2 3\n', '3 1\n-1 -5 7\n', '4 4\n1 1 1 1\n', '1 1\n42\n']
    for n in (8, 30, 200):
        a = [random.randint(-20, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)]
    out.append(f"40000 100\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    if n > 300:
        return None
    return '\n'.join(str(sorted(a[:i + 1], reverse=True)[k - 1]) if i + 1 >= k else '-1' for i in range(n))
