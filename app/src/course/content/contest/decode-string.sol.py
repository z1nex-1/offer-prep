import sys


def main():
    s = sys.stdin.readline().strip()
    stack = []
    cur, num = [], 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + ord(ch) - 48
        elif ch == '[':
            stack.append((cur, num))
            cur, num = [], 0
        elif ch == ']':
            prev, k = stack.pop()
            prev.append(''.join(cur) * k)
            cur = prev
        else:
            cur.append(ch)
    print(''.join(cur))


main()
