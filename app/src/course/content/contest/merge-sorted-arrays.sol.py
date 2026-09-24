import sys


def main():
    lines = sys.stdin.read().split('\n')
    n = int(lines[0])
    a = list(map(int, lines[1].split())) if n else []
    m = int(lines[2])
    b = list(map(int, lines[3].split())) if m else []
    i = j = 0
    res = []
    while i < n and j < m:
        if a[i] <= b[j]:
            res.append(a[i])
            i += 1
        else:
            res.append(b[j])
            j += 1
    res.extend(a[i:])
    res.extend(b[j:])
    print(' '.join(map(str, res)))


main()
