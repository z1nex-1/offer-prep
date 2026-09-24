import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    best = cur = 0
    for x in data[1:n + 1]:
        if x == '1':
            cur += 1
            best = max(best, cur)
        else:
            cur = 0
    print(best)


main()
