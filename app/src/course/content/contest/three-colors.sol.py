import sys

data = sys.stdin.read().split()
n = int(data[0])
a = data[1:1 + n]
lo, mid, hi = 0, 0, n - 1
while mid <= hi:
    if a[mid] == '0':
        a[lo], a[mid] = a[mid], a[lo]
        lo += 1
        mid += 1
    elif a[mid] == '1':
        mid += 1
    else:
        a[mid], a[hi] = a[hi], a[mid]
        hi -= 1
print(' '.join(a))
