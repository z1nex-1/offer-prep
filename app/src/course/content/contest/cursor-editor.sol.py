import sys


def main():
    s = sys.stdin.readline().strip()
    size = len(s) + 2
    nxt = [0] * size
    prv = [0] * size
    ch = [''] * size
    HEAD, TAIL = 0, 1
    nxt[HEAD], prv[TAIL] = TAIL, HEAD
    cur, free = HEAD, 2
    for c in s:
        if c == '<':
            if cur != HEAD:
                cur = prv[cur]
        elif c == '>':
            if nxt[cur] != TAIL:
                cur = nxt[cur]
        elif c == '#':
            if cur != HEAD:
                p, q = prv[cur], nxt[cur]
                nxt[p], prv[q] = q, p
                cur = p
        elif c == '^':
            cur = HEAD
        elif c == '$':
            cur = prv[TAIL]
        else:
            node, free = free, free + 1
            ch[node] = c
            q = nxt[cur]
            nxt[cur], prv[node], nxt[node], prv[q] = node, cur, q, node
            cur = node
    out, v = [], nxt[HEAD]
    while v != TAIL:
        out.append(ch[v])
        v = nxt[v]
    print(''.join(out) or 'empty')


main()
