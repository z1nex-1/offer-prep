import sys


def main():
    vals = sys.stdin.read().split()
    left, right = {}, {}
    queue = [0]
    pos = 1
    for v in queue:
        if pos < len(vals):
            if vals[pos] != "null":
                left[v] = pos
                queue.append(pos)
            pos += 1
        if pos < len(vals):
            if vals[pos] != "null":
                right[v] = pos
                queue.append(pos)
            pos += 1
    level = [0]
    res = []
    while level:
        res.append(vals[level[-1]])
        nxt = []
        for v in level:
            if v in left:
                nxt.append(left[v])
            if v in right:
                nxt.append(right[v])
        level = nxt
    print(" ".join(res))


main()
