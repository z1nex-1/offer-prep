import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    far = 0
    for i in range(n):
        if i > far:
            print('NO')
            return
        far = max(far, i + int(data[1 + i]))
    print('YES')


main()
