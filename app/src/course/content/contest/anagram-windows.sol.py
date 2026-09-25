import sys


def main():
    data = sys.stdin.read().split()
    s, p = data[0], data[1]
    n, m = len(s), len(p)
    need = [0] * 26
    have = [0] * 26
    for ch in p:
        need[ord(ch) - 97] += 1
    matched = sum(1 for c in range(26) if need[c] == 0)
    res = []

    def change(c, d):
        nonlocal matched
        if have[c] == need[c]:
            matched -= 1
        have[c] += d
        if have[c] == need[c]:
            matched += 1

    for i in range(n):
        change(ord(s[i]) - 97, 1)
        if i >= m:
            change(ord(s[i - m]) - 97, -1)
        if i >= m - 1 and matched == 26:
            res.append(i - m + 2)
    print(len(res))
    print(' '.join(map(str, res)))


main()
