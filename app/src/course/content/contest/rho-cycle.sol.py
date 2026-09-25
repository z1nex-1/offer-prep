import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    nxt = [0] + list(map(int, data[1:n + 1]))
    slow = fast = 1
    while True:
        if nxt[fast] == 0 or nxt[nxt[fast]] == 0:
            length, cur = 0, 1
            while cur:
                length += 1
                cur = nxt[cur]
            print(length, 0)
            return
        slow = nxt[slow]
        fast = nxt[nxt[fast]]
        if slow == fast:
            break
    c, cur = 1, nxt[slow]
    while cur != slow:
        c += 1
        cur = nxt[cur]
    a, p, q = 0, 1, slow
    while p != q:
        a += 1
        p, q = nxt[p], nxt[q]
    print(a, c)


main()
