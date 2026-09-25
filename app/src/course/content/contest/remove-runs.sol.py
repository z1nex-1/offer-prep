import sys


def main():
    n, k = map(int, sys.stdin.readline().split())
    s = sys.stdin.readline().strip()
    colors, counts = [], []
    for ch in s:
        if colors and colors[-1] == ch:
            counts[-1] += 1
            if counts[-1] == k:
                colors.pop()
                counts.pop()
        else:
            colors.append(ch)
            counts.append(1)
    res = ''.join(c * m for c, m in zip(colors, counts))
    print(res or 'empty')


main()
