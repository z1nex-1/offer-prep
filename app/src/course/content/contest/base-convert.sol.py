DIG = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

a, b = map(int, input().split())
x = int(input().strip(), a)
if x == 0:
    print('0')
else:
    out = []
    while x:
        x, r = divmod(x, b)
        out.append(DIG[r])
    print(''.join(reversed(out)))
