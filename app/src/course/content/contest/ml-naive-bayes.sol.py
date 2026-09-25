import sys
from collections import Counter, defaultdict
from math import log

lines = sys.stdin.read().split('\n')
n = int(lines[0])
docs = Counter()
cnt = defaultdict(Counter)
total = Counter()
vocab = set()
for line in lines[1:1 + n]:
    parts = line.split()
    c, words = parts[0], parts[1:]
    docs[c] += 1
    cnt[c].update(words)
    total[c] += len(words)
    vocab.update(words)
V = len(vocab)
q = int(lines[1 + n])
classes = sorted(docs)
out = []
for line in lines[2 + n:2 + n + q]:
    words = [w for w in line.split() if w in vocab]
    best, best_c = None, None
    for c in classes:
        s = log(docs[c] / n)
        den = total[c] + V
        for w in words:
            s += log((cnt[c][w] + 1) / den)
        if best is None or s > best:
            best, best_c = s, c
    out.append(best_c)
print('\n'.join(out))
