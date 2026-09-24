import sys
from collections import Counter


def main():
    s = sys.stdin.readline().strip()
    cnt = Counter(s)
    for i, ch in enumerate(s):
        if cnt[ch] == 1:
            print(i + 1)
            return
    print(-1)


main()
