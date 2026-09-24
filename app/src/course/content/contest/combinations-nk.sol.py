import sys


def main():
    n, k = map(int, sys.stdin.read().split())
    out, cur = [], []

    def go(start):
        if len(cur) == k:
            out.append(" ".join(map(str, cur)))
            return
        for x in range(start, n + 1):
            if len(cur) + (n - x + 1) < k:
                break
            cur.append(x)
            go(x + 1)
            cur.pop()

    go(1)
    print("\n".join(out))


main()
