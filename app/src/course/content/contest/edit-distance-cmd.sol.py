import sys


def main():
    lines = sys.stdin.read().split('\n')
    a = lines[0].strip() if lines else ''
    b = lines[1].strip() if len(lines) > 1 else ''
    prev = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        cur = [i] + [0] * len(b)
        ai = a[i - 1]
        for j in range(1, len(b) + 1):
            if ai == b[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    print(prev[len(b)])


main()
