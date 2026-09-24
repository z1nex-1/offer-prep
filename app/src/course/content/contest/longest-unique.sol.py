import sys


def main():
    s = sys.stdin.readline().strip()
    last = {}
    l = best = 0
    for r, ch in enumerate(s):
        if last.get(ch, -1) >= l:
            l = last[ch] + 1
        last[ch] = r
        if r - l + 1 > best:
            best = r - l + 1
    print(best)


main()
