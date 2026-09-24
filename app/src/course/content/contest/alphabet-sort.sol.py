import sys

data = sys.stdin.read().split()
alphabet = data[0]
n = int(data[1])
words = data[2:2 + n]
table = str.maketrans(alphabet, 'abcdefghijklmnopqrstuvwxyz')
print('\n'.join(sorted(words, key=lambda w: w.translate(table))))
