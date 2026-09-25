import random


def fmt(n, tasks):
    return f"{n} {len(tasks)}\n" + '\n'.join(f'{t} {d}' for t, d in tasks) + '\n'


def rand_tasks(m, step, dmax):
    t, res = 0, []
    for _ in range(m):
        t += random.randint(0, step)
        res.append((t, random.randint(1, dmax)))
    return res


def tests():
    random.seed(115)
    out = [fmt(2, [(0, 3), (1, 2), (2, 5), (3, 1)]), fmt(1, [(0, 5), (0, 5), (0, 5)]), fmt(3, [(10, 1)]), fmt(2, [(0, 2), (0, 2), (2, 1), (2, 1)])]
    for n, m in ((2, 8), (3, 30), (5, 100)):
        out.append(fmt(n, rand_tasks(m, 3, 10)))
    out.append(fmt(1000, rand_tasks(40000, 2, 3000)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if m > 200:
        return None
    avail = [0] * n
    out = []
    for i in range(m):
        t, dur = d[2 + 2 * i], d[3 + 2 * i]
        freeidx = [s for s in range(n) if avail[s] <= t]
        if freeidx:
            s = min(freeidx)
            end = t + dur
        else:
            s = min(range(n), key=lambda x: (avail[x], x))
            end = avail[s] + dur
        avail[s] = end
        out.append(f'{s} {end}')
    return '\n'.join(out)
