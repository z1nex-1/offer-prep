import sys


def ok(p):
    if not 8 <= len(p) <= 32:
        return False
    if not any('a' <= c <= 'z' for c in p):
        return False
    if not any('A' <= c <= 'Z' for c in p):
        return False
    if not any('0' <= c <= '9' for c in p):
        return False
    for i in range(2, len(p)):
        if p[i] == p[i - 1] == p[i - 2]:
            return False
    return True


data = sys.stdin.read().split()
q = int(data[0])
print('\n'.join('YES' if ok(p) else 'NO' for p in data[1:1 + q]))
