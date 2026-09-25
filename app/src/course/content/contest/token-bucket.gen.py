import random


def fmt(b, r, ts):
    return f"{b} {r} {len(ts)}\n{' '.join(map(str, ts))}\n"


def rand_ts(n, step):
    t, ts = 0, []
    for _ in range(n):
        t += random.randint(0, step)
        ts.append(t)
    return ts


def tests():
    random.seed(93)
    out = [fmt(2, 1, [0, 0, 0, 1, 1, 3, 3, 3]), fmt(1, 0, [5, 6, 7]), fmt(3, 10, [100, 100, 100, 100]), fmt(5, 1, [0])]
    for b, r, n, step in ((2, 1, 20, 2), (3, 2, 50, 1), (5, 1, 200, 3)):
        out.append(fmt(b, r, rand_ts(n, step)))
    out.append(fmt(1000, 7, rand_ts(40000, 1)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    b, r, n = d[0], d[1], d[2]
    ts = d[3:]
    if ts and ts[-1] > 5000:
        return None
    tokens, sec, out, i = b, 0, [], 0
    for s in range(0, ts[-1] + 1):
        if s > 0:
            tokens = min(b, tokens + r)
        while i < n and ts[i] == s:
            if tokens >= 1:
                tokens -= 1
                out.append('ALLOW')
            else:
                out.append('DENY')
            i += 1
    return '\n'.join(out)
