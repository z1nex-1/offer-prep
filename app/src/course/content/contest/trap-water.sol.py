import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    h = list(map(int, data[1:n + 1]))
    l, r = 0, n - 1
    lmax = rmax = water = 0
    while l <= r:
        if lmax <= rmax:
            lmax = max(lmax, h[l])
            water += lmax - h[l]
            l += 1
        else:
            rmax = max(rmax, h[r])
            water += rmax - h[r]
            r -= 1
    print(water)


main()
