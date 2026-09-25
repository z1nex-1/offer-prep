import sys


def main():
    s = sys.stdin.read()
    nums, ops = [], []
    prio = {'+': 1, '-': 1, '*': 2}

    def apply():
        op = ops.pop()
        b = nums.pop()
        a = nums.pop()
        nums.append(a + b if op == '+' else a - b if op == '-' else a * b)

    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c.isdigit():
            j = i
            while j < n and s[j].isdigit():
                j += 1
            nums.append(int(s[i:j]))
            i = j
            continue
        if c == '(':
            ops.append(c)
        elif c == ')':
            while ops[-1] != '(':
                apply()
            ops.pop()
        elif c in prio:
            while ops and ops[-1] != '(' and prio[ops[-1]] >= prio[c]:
                apply()
            ops.append(c)
        i += 1
    while ops:
        apply()
    print(nums[0])


main()
