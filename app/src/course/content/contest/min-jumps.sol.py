import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    jumps = end = far = 0
    for i in range(n - 1):
        far = max(far, i + int(data[1 + i]))
        if i == end:
            jumps += 1
            end = far
    print(jumps)


main()
