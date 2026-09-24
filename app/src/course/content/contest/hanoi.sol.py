import sys


def move(n, a, b, c, out):
    if n == 0:
        return
    move(n - 1, a, c, b, out)
    out.append(f"{a} {c}")
    move(n - 1, b, a, c, out)


def main():
    n = int(sys.stdin.readline())
    out = []
    move(n, 1, 2, 3, out)
    print(len(out))
    print("\n".join(out))


main()
