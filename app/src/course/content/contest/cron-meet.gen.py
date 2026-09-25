import random


def tests():
    random.seed(137)
    out = ['0 4 2 6\n', '1 4 0 6\n', '10 3 0 5\n', '5 1 5 1\n', '7 2 0 7\n', '100 5 0 10\n']
    for _ in range(4):
        out.append(f"{random.randint(0, 60)} {random.randint(1, 12)} {random.randint(0, 60)} {random.randint(1, 12)}\n")
    out.append('0 999983 1 999979\n')
    out.append('1000000000 999999 3 1000000\n')
    out.append('123456789 600000 987654321 400000\n')
    return out


def brute(inp):
    s1, p, s2, q = map(int, inp.split())
    if p * q > 10 ** 4 or max(s1, s2) > 1000:
        return None
    t = max(s1, s2)
    for t in range(t, t + p * q + 1):
        if t >= s1 and (t - s1) % p == 0 and t >= s2 and (t - s2) % q == 0:
            return t
    return -1
