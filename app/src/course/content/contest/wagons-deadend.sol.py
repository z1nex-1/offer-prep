import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    st = []
    need = 1
    for x in data[1:n + 1]:
        st.append(int(x))
        while st and st[-1] == need:
            st.pop()
            need += 1
    print('YES' if not st else 'NO')


main()
