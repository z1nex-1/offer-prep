import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, head = int(data[0]), int(data[1])
    val = data[2::2]
    nxt = list(map(int, data[3::2]))
    out = []
    cur = head
    while cur:
        out.append(val[cur - 1].decode())
        cur = nxt[cur - 1]
    print(' '.join(out))


main()
