import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def stack_sortable(n):
    out, st, i = [], [], 1
    seq = []
    while i <= n or st:
        if i <= n and (not st or random.random() < 0.5):
            st.append(i); i += 1
        else:
            seq.append(st.pop())
    return seq


def tests():
    random.seed(88)
    out = [fmt([3, 2, 1]), fmt([4, 1, 3, 2]), fmt([2, 3, 1]), fmt([1]), fmt([1, 2, 3])]
    for n in (5, 8, 40):
        a = list(range(1, n + 1))
        random.shuffle(a)
        out.append(fmt(a))
    out.append(fmt(list(range(40000, 0, -1))))
    a = list(range(1, 40001))
    random.shuffle(a)
    out.append(fmt(a))
    return out


def brute(inp):
    from itertools import product
    a = list(map(int, inp.split()[1:]))
    n = len(a)
    if n > 9:
        return None
    # полный перебор последовательностей операций: заехать / выехать
    def go(i, st, need):
        if need > n:
            return True
        ok = False
        if st and st[-1] == need:
            ok = go(i, st[:-1], need + 1)
        if not ok and i < n:
            ok = go(i + 1, st + [a[i]], need)
        return ok
    return 'YES' if go(0, [], 1) else 'NO'
