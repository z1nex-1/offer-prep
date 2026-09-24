import sys


def main():
    s = sys.stdin.readline().strip()

    def parse(i, depth):
        i += 1
        total = 0
        while s[i] != "]":
            if s[i] == "[":
                i, sub = parse(i, depth + 1)
                total += sub
            else:
                j = i + 1
                while s[j] not in ",]":
                    j += 1
                total += int(s[i:j]) * depth
                i = j
            if s[i] == ",":
                i += 1
        return i + 1, total

    print(parse(0, 1)[1])


main()
