import sys


def main():
    k = int(sys.stdin.readline())
    s = sys.stdin.readline().strip()
    best = 0
    for c in set(s):
        l = bad = 0
        for r, ch in enumerate(s):
            if ch != c:
                bad += 1
            while bad > k:
                if s[l] != c:
                    bad -= 1
                l += 1
            if r - l + 1 > best:
                best = r - l + 1
    print(best)


main()
