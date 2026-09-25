import sys


def main():
    data = sys.stdin.read().split()
    n, q = int(data[0]), int(data[1])
    children = [{}]
    count = [0]
    for word in data[2:2 + n]:
        v = 0
        for ch in word:
            nxt = children[v].get(ch)
            if nxt is None:
                nxt = len(children)
                children[v][ch] = nxt
                children.append({})
                count.append(0)
            v = nxt
            count[v] += 1
    out = []
    for prefix in data[2 + n:2 + n + q]:
        v = 0
        for ch in prefix:
            v = children[v].get(ch)
            if v is None:
                break
        out.append(0 if v is None else count[v])
    print("\n".join(map(str, out)))


main()
