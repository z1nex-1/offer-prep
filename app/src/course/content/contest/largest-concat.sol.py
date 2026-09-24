import sys
from functools import cmp_to_key


def cmp(a, b):
    if a + b > b + a:
        return -1
    if a + b < b + a:
        return 1
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = sorted(data[1:n + 1], key=cmp_to_key(cmp))
    res = ''.join(nums).lstrip('0')
    print(res or '0')


main()
