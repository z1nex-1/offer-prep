import sys

lines = sys.stdin.read().split('\n')
p = lines[0].strip()
words = lines[1].split()


def pattern(seq):
    first = {}
    return tuple(first.setdefault(x, len(first)) for x in seq)


print('YES' if len(p) == len(words) and pattern(p) == pattern(words) else 'NO')
