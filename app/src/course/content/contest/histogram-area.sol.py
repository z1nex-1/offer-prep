import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    h = list(map(int, data[1:n + 1])) + [0]
    st = []
    best = 0
    for i, cur in enumerate(h):
        while st and h[st[-1]] >= cur:
            height = h[st.pop()]
            left = st[-1] if st else -1
            area = height * (i - left - 1)
            if area > best:
                best = area
        st.append(i)
    print(best)


main()
