import sys


def sort_count(a):
    if len(a) <= 1:
        return a, 0
    mid = len(a) // 2
    left, x = sort_count(a[:mid])
    right, y = sort_count(a[mid:])
    res = []
    inv = x + y
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i])
            i += 1
        else:
            res.append(right[j])
            inv += len(left) - i
            j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res, inv


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    print(sort_count(list(map(int, data[1:n + 1])))[1])


main()
