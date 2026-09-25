import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k, head = int(data[0]), int(data[1]), int(data[2])
    val = [b''] + data[3::2]
    nxt = [0] + list(map(int, data[4::2]))
    dummy = 0
    nxt[dummy] = head
    before = dummy
    while True:
        probe, cnt = nxt[before], 0
        while probe and cnt < k:
            probe = nxt[probe]
            cnt += 1
        if cnt < k:
            break
        first = nxt[before]
        prev, cur = probe, first
        for _ in range(k):
            cur_next = nxt[cur]
            nxt[cur] = prev
            prev, cur = cur, cur_next
        nxt[before] = prev
        before = first
    out, cur = [], nxt[dummy]
    while cur:
        out.append(val[cur].decode())
        cur = nxt[cur]
    print(' '.join(out))


main()
