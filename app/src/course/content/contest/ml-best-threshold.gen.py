import random


def case(rows):
    return f"{len(rows)}\n" + ''.join(f"{y} {s}\n" for y, s in rows)


def gen(n, rate, spread, sep):
    rows = []
    for _ in range(n):
        y = 1 if random.random() < rate else 0
        rows.append((y, max(0, min(10 ** 9, int(random.gauss(spread * (1 + (sep if y else 0)), spread * 0.5))))))
    if not any(y for y, _ in rows):
        rows[0] = (1, rows[0][1])
    return rows


def tests():
    random.seed(404)
    out = [case([(1, 90), (0, 80), (1, 70), (0, 60), (1, 50), (0, 10)]), case([(1, 5), (0, 5), (0, 5), (1, 3)])]
    out.append(case([(1, 7)]))
    out.append(case([(1, 1), (0, 2)]))
    out.append(case([(0, 4), (0, 4), (1, 4), (0, 1), (1, 0)]))
    for n in (8, 25, 120):
        out.append(case(gen(n, 0.4, 10, 0.5)))
    out.append(case(gen(3000, 0.1, 1000, 0.3)))
    out.append(case(gen(40000, 0.02, 10 ** 6, 1.0)))
    out.append(case(gen(40000, 0.5, 30, 0.2)))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    rows = [(int(d[1 + 2 * i]), int(d[2 + 2 * i])) for i in range(n)]
    P = sum(y for y, _ in rows)
    best = 0.0
    for t in {s for _, s in rows}:
        tp = sum(1 for y, s in rows if s >= t and y)
        fp = sum(1 for y, s in rows if s >= t and not y)
        if tp:
            best = max(best, 2 * tp / (2 * tp + fp + (P - tp)))
    return f"{best:.9f}"
