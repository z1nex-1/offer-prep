import sys
import heapq


def main():
    data = sys.stdin.read().split('\n')
    q = int(data[0])
    cnt = {}
    out = []
    for line in data[1:q + 1]:
        c, x = line.split()
        if c == 'ADD':
            cnt[x] = cnt.get(x, 0) + 1
        else:
            best = heapq.nsmallest(int(x), cnt.items(), key=lambda kv: (-kv[1], kv[0]))
            out.append(' '.join(w for w, _ in best))
    print('\n'.join(out))


main()
