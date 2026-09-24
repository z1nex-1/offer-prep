import sys


def main():
    data = sys.stdin.read().split()
    s, T = data[0], int(data[1])
    n = len(s)

    def go(pos, value):
        if pos == n:
            return 1 if value == T else 0
        total = 0
        for j in range(pos + 1, n + 1):
            num = int(s[pos:j])
            if pos == 0:
                total += go(j, num)
            else:
                total += go(j, value + num) + go(j, value - num)
        return total

    print(go(0, 0))


main()
