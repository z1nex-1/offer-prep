import sys


def main():
    j = sys.stdin.readline().strip()
    s = sys.stdin.readline().strip()
    jewels = set(j)
    print(sum(1 for ch in s if ch in jewels))


main()
