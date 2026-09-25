import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, c = int(data[0]), int(data[1])
    print(sum(-(-int(x) // c) for x in data[2:2 + n]))


main()
