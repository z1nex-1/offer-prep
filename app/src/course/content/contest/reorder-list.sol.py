import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, head = int(data[0]), int(data[1])
    val = [b''] + data[2::2]
    nxt = [0] + list(map(int, data[3::2]))
    slow = fast = head
    while nxt[fast] and nxt[nxt[fast]]:
        slow = nxt[slow]
        fast = nxt[nxt[fast]]
    second = nxt[slow]
    nxt[slow] = 0
    prev = 0
    while second:
        second_next = nxt[second]
        nxt[second] = prev
        prev, second = second, second_next
    a, b = head, prev
    while b:
        a_next, b_next = nxt[a], nxt[b]
        nxt[a] = b
        nxt[b] = a_next
        a, b = a_next, b_next
    out, cur = [], head
    while cur:
        out.append(val[cur].decode())
        cur = nxt[cur]
    print(' '.join(out))


main()
