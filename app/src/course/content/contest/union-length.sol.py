import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    segs = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
    total = 0
    cur_l, cur_r = segs[0]
    for l, r in segs[1:]:
        if l <= cur_r:
            cur_r = max(cur_r, r)
        else:
            total += cur_r - cur_l
            cur_l, cur_r = l, r
    total += cur_r - cur_l
    print(total)


main()
