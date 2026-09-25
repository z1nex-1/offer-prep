import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    val = [0] * (n + 1)
    left = [0] * (n + 1)
    right = [0] * (n + 1)
    for i in range(1, n + 1):
        val[i], left[i], right[i] = int(data[3 * i - 2]), int(data[3 * i - 1]), int(data[3 * i])
    stack = [(1, float("-inf"), float("inf"))]
    while stack:
        v, lo, hi = stack.pop()
        if not lo < val[v] < hi:
            print("NO")
            return
        if left[v]:
            stack.append((left[v], lo, val[v]))
        if right[v]:
            stack.append((right[v], val[v], hi))
    print("YES")


main()
