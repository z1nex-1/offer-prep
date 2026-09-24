import sys


def spiral(a):
    res = []
    top, bottom, left, right = 0, len(a) - 1, 0, len(a[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            res.append(a[top][j])
        top += 1
        for i in range(top, bottom + 1):
            res.append(a[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                res.append(a[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                res.append(a[i][left])
            left += 1
    return res


data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
a = [data[2 + i * m:2 + (i + 1) * m] for i in range(n)]
print(' '.join(spiral(a)))
