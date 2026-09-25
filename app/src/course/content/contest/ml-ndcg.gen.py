import random


def build(queries, k, shuffle=True):
    rows = []
    for q, docs in queries.items():
        for (s, rel) in docs:
            rows.append((q, s, rel))
    if shuffle:
        random.shuffle(rows)
    return f"{len(rows)} {k}\n" + ''.join(f"{q} {s} {r}\n" for q, s, r in rows)


def rand_queries(nq, m_lo, m_hi, noise, zero_rate=0.1):
    qs = {}
    for q in random.sample(range(1, 10 ** 6), nq):
        m = random.randint(m_lo, m_hi)
        if random.random() < zero_rate:
            rels = [0] * m
        else:
            rels = [random.choice([0, 0, 0, 1, 1, 2, 3, 4]) for _ in range(m)]
        scores = random.sample(range(1, 10 ** 6), m)
        keyed = sorted(range(m), key=lambda i: rels[i] + random.gauss(0, noise))
        docs = [(sorted(scores)[pos], rels[i]) for pos, i in enumerate(keyed)]
        qs[q] = docs
    if all(r == 0 for d in qs.values() for _, r in d):
        q = next(iter(qs))
        qs[q][0] = (qs[q][0][0], 1)
    return qs


def tests():
    random.seed(406)
    s1 = "5 3\n1 50 3\n1 40 2\n1 90 0\n1 10 1\n2 7 1\n"
    s2 = "4 2\n10 4 0\n10 3 0\n20 1 2\n20 2 0\n"
    out = [s1, s2]
    out.append("3 5\n1 3 2\n1 2 1\n1 1 0\n")
    out.append("3 1\n1 1 2\n1 2 1\n1 3 0\n")
    out.append("4 10\n5 1 0\n5 2 0\n6 9 4\n7 3 0\n")
    for nq, lo, hi, k in ((3, 2, 5, 3), (10, 1, 10, 5), (50, 5, 30, 10)):
        out.append(build(rand_queries(nq, lo, hi, 1.5), k))
    out.append(build(rand_queries(1000, 10, 30, 2.0), 10))
    out.append(build(rand_queries(150, 100, 150, 1.0), 100))
    return out


def brute(inp):
    from math import log2
    d = inp.split()
    n, k = int(d[0]), int(d[1])
    by = {}
    for i in range(n):
        by.setdefault(d[2 + 3 * i], []).append((int(d[3 + 3 * i]), int(d[4 + 3 * i])))
    vals = []
    for docs in by.values():
        model = [r for _, r in sorted(docs, key=lambda x: -x[0])][:k]
        ideal = sorted((r for _, r in docs), reverse=True)[:k]
        g = lambda rs: sum((2 ** r - 1) / log2(i + 1) for i, r in enumerate(rs, 1))
        if g(ideal) > 0:
            vals.append(g(model) / g(ideal))
    return f"{sum(vals) / len(vals):.9f}"
