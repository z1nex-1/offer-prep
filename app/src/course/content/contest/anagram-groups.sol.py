import sys
from collections import Counter


def main():
    words = sys.stdin.read().split()[1:]
    cnt = Counter(''.join(sorted(w)) for w in words)
    print(len(cnt), max(cnt.values()))


main()
