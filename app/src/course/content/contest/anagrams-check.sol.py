import sys
from collections import Counter


def main():
    a = sys.stdin.readline().strip()
    b = sys.stdin.readline().strip()
    print(1 if Counter(a) == Counter(b) else 0)


main()
