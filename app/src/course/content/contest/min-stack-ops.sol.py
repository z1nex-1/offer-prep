import sys


def main():
    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    pos = 1
    st, out = [], []
    for _ in range(q):
        t = data[pos]
        pos += 1
        if t == b'1':
            x = int(data[pos])
            pos += 1
            st.append(min(x, st[-1]) if st else x)
        elif t == b'2':
            st.pop()
        else:
            out.append(st[-1])
    print('\n'.join(map(str, out)))


main()
