import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, h1, h2 = int(data[0]), int(data[1]), int(data[2])
    nxt = [0] + list(map(int, data[3:n + 3]))
    a, b = h1, h2
    while a != b:
        a = nxt[a] if a else h2
        b = nxt[b] if b else h1
    print(a)


main()
