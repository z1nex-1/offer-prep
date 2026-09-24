import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    a = list(map(int, data[1:n + 1]))
    parts = []
    i = 0
    while i < n:
        j = i
        while j + 1 < n and a[j + 1] == a[j] + 1:
            j += 1
        parts.append(str(a[i]) if i == j else f"{a[i]}-{a[j]}")
        i = j + 1
    print(",".join(parts))


main()
