import sys


def main():
    data = sys.stdin.buffer.read().split()
    b, r, n = int(data[0]), int(data[1]), int(data[2])
    tokens, last = b, 0
    out = []
    for x in data[3:3 + n]:
        t = int(x)
        tokens = min(b, tokens + (t - last) * r)
        last = t
        if tokens >= 1:
            tokens -= 1
            out.append('ALLOW')
        else:
            out.append('DENY')
    print('\n'.join(out))


main()
