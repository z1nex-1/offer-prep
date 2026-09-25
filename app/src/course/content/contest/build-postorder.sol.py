import sys


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    pre = data[1:n + 1]
    ino = data[n + 1:2 * n + 1]
    pos = {v: i for i, v in enumerate(ino)}
    post = []

    def build(pre_lo, in_lo, size):
        if size == 0:
            return
        root = pre[pre_lo]
        k = pos[root] - in_lo
        build(pre_lo + 1, in_lo, k)
        build(pre_lo + 1 + k, pos[root] + 1, size - 1 - k)
        post.append(root)

    build(0, 0, n)
    print(" ".join(post))


main()
