import sys

k = int(sys.stdin.readline()) % 26
s = sys.stdin.readline().rstrip('\r\n')
out = []
for ch in s:
    if 'a' <= ch <= 'z':
        out.append(chr((ord(ch) - ord('a') + k) % 26 + ord('a')))
    elif 'A' <= ch <= 'Z':
        out.append(chr((ord(ch) - ord('A') + k) % 26 + ord('A')))
    else:
        out.append(ch)
print(''.join(out))
