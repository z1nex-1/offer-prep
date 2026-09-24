import sys


def main():
    data = sys.stdin.read().split()
    n, S = int(data[0]), int(data[1])
    a = list(map(int, data[2:2 + n]))

    def go(i, s, taken):
        if i == n:
            return 1 if s == S and taken > 0 else 0
        return go(i + 1, s, taken) + go(i + 1, s + a[i], taken + 1)

    print(go(0, 0, 0))


main()
