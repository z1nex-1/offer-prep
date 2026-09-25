import sys


def main():
    s = sys.stdin.readline().strip()
    pair = {')': '(', ']': '[', '}': '{'}
    st = []
    for ch in s:
        if ch in '([{':
            st.append(ch)
        elif not st or st.pop() != pair[ch]:
            print('no')
            return
    print('no' if st else 'yes')


main()
