import sys
from collections import Counter


def main():
    s = sys.stdin.readline().strip()
    cnt = Counter(s)
    letters = sorted(cnt)
    cur, out = [], []

    def go():
        if len(cur) == len(s):
            out.append("".join(cur))
            return
        for ch in letters:
            if cnt[ch]:
                cnt[ch] -= 1
                cur.append(ch)
                go()
                cur.pop()
                cnt[ch] += 1

    go()
    print("\n".join(out))


main()
