import sys

data = sys.stdin.read().split()
num, k = data[0], int(data[1])
st = []
for d in num:
    while k and st and st[-1] > d:
        st.pop()
        k -= 1
    st.append(d)
if k:
    del st[-k:]
print(''.join(st).lstrip('0') or '0')
