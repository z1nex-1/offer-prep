import sys


def norm(v):
    parts = [int(x) for x in v.split('.')]
    while parts and parts[-1] == 0:
        parts.pop()
    return parts


def main():
    lines = sys.stdin.read().split('\n')
    q = int(lines[0])
    out = []
    for i in range(1, q + 1):
        a, b = lines[i].split()
        x, y = norm(a), norm(b)
        out.append('<' if x < y else '>' if x > y else '=')
    print('\n'.join(out))


main()
