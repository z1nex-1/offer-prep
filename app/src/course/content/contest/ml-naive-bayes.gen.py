import random
from collections import Counter, defaultdict
from math import log


def scores(train, doc):
    n = len(train)
    docs = Counter(c for c, _ in train)
    cnt = defaultdict(Counter)
    tot = Counter()
    vocab = set()
    for c, ws in train:
        cnt[c].update(ws)
        tot[c] += len(ws)
        vocab.update(ws)
    V = len(vocab)
    return {c: log(docs[c] / n) + sum(log((cnt[c][w] + 1) / (tot[c] + V)) for w in doc if w in vocab) for c in docs}


def clear(train, doc):
    s = sorted(scores(train, doc).values(), reverse=True)
    return len(s) == 1 or s[0] - s[1] > 1e-5


def case(train, test):
    return f"{len(train)}\n" + ''.join(f"{c} {' '.join(ws)}\n" for c, ws in train) + f"{len(test)}\n" + ''.join(' '.join(ws) + '\n' for ws in test)


def topic_data(n, q, classes, vocab_size, doc_len):
    words = [''.join(random.choice('abcdefghij') for _ in range(random.randint(2, 6))) for _ in range(vocab_size)]
    words = sorted(set(words))
    fav = {c: random.sample(words, max(3, len(words) // 5)) for c in classes}
    def doc(c):
        return [random.choice(fav[c]) if random.random() < 0.6 else random.choice(words) for _ in range(random.randint(0, doc_len))]
    train = [(c, doc(c)) for c in random.choices(classes, k=n)]
    for c in classes:
        if not any(t == c for t, _ in train):
            train.append((c, doc(c)))
    test = []
    while len(test) < q:
        d = doc(random.choice(classes))
        if random.random() < 0.2:
            d.append('zzz')
        if clear(train, d):
            test.append(d)
    return train, test


def tests():
    random.seed(408)
    s1 = case([('spam', 'buy cheap pills'.split()), ('spam', 'cheap offer buy'.split()), ('ham', 'meeting at noon'.split()), ('ham', 'lunch at noon buy'.split())],
              ['cheap pills'.split(), 'noon meeting'.split(), 'buy'.split()])
    s2 = case([('a', 'x x y'.split()), ('b', 'y z'.split()), ('b', 'z'.split())], [[], 'x'.split(), 'q q'.split()])
    out = [s1, s2]
    out.append(case([('only', 'one two'.split())], ['one'.split(), []]))
    for n, q, cl, vs, dl in ((10, 5, ['sport', 'news'], 20, 6), (60, 30, ['a', 'b', 'c'], 50, 10), (400, 200, ['x', 'y', 'z', 'w'], 300, 20), (2000, 600, ['p', 'q', 'r', 's', 't'], 2000, 30)):
        tr, te = topic_data(n, q, cl, vs, dl)
        out.append(case(tr, te))
    return out


def brute(inp):
    lines = inp.split('\n')
    n = int(lines[0])
    train = [(l.split()[0], l.split()[1:]) for l in lines[1:1 + n]]
    q = int(lines[1 + n])
    res = []
    for l in lines[2 + n:2 + n + q]:
        s = scores(train, l.split())
        res.append(max(sorted(s), key=lambda c: s[c]))
    return '\n'.join(res)
