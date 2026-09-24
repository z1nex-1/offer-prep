import sys


def main():
    data = sys.stdin.read().split()
    q = int(data[0])
    out = []
    for i in range(q):
        a, n, m = int(data[1 + 3 * i]), int(data[2 + 3 * i]), int(data[3 + 3 * i])

        def go(n):
            if n == 0:
                return 0, 1 % m
            if n % 2 == 1:
                s, p = go(n - 1)
                return (1 + a * s) % m, p * a % m
            s, p = go(n // 2)
            return s * (1 + p) % m, p * p % m

        out.append(go(n)[0])
    print("\n".join(map(str, out)))


main()
