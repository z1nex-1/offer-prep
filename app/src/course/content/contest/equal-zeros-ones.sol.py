import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    first = {0: 0}
    cur = best = 0
    for i in range(1, n + 1):
        cur += 1 if data[i] == b'1' else -1
        if cur in first:
            best = max(best, i - first[cur])
        else:
            first[cur] = i
    print(best)


main()
