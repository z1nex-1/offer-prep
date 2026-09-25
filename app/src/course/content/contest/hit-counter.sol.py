import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    dq = deque()
    out = []
    for i in range(q):
        cmd, t = data[1 + 2 * i], int(data[2 + 2 * i])
        if cmd == b'HIT':
            dq.append(t)
        else:
            while dq and dq[0] <= t - 300:
                dq.popleft()
            out.append(len(dq))
    print('\n'.join(map(str, out)))


main()
