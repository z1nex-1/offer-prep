import sys


def main():
    st, out = [], []
    for line in sys.stdin.read().splitlines():
        cmd = line.split()
        if not cmd:
            continue
        c = cmd[0]
        if c == 'push':
            st.append(cmd[1])
            out.append('ok')
        elif c == 'pop':
            out.append(st.pop() if st else 'error')
        elif c == 'back':
            out.append(st[-1] if st else 'error')
        elif c == 'size':
            out.append(str(len(st)))
        elif c == 'clear':
            st.clear()
            out.append('ok')
        elif c == 'exit':
            out.append('bye')
            break
    print('\n'.join(out))


main()
