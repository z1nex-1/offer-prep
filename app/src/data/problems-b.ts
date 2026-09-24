import type { Problem } from '../types'

const T = (val: number, left: unknown = null, right: unknown = null) => ({ val, left, right })

const TREE_NOTE = `

Дерево передаётся вложенными объектами: \`{"val": 1, "left": {...}, "right": null}\`. В Python это словарь (\`node["val"]\`), в JS — объект (\`node.val\`). Пустое дерево — \`null\` / \`None\`.`

export const problemsB: Problem[] = [
  {
    id: 'valid-parentheses',
    title: 'Правильная скобочная последовательность',
    difficulty: 'easy',
    pattern: 'Стек и очередь',
    topic: 'algo-stack-queue',
    statement: `Строка состоит из символов \`()[]{}\`. Проверьте, что скобки закрываются в правильном порядке и правильного типа.`,
    fn: 'isValid',
    params: ['s'],
    tests: [
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
      { args: ['(('], expected: false },
      { args: ['))'], expected: false },
    ],
    solution: {
      py: `def isValid(s):
    pair = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pair:
            if not st or st[-1] != pair[ch]:
                return False
            st.pop()
        else:
            st.append(ch)
    return not st`,
      js: `function isValid(s) {
    const pair = { ')': '(', ']': '[', '}': '{' }
    const st = []
    for (const ch of s) {
        if (ch in pair) {
            if (!st.length || st[st.length - 1] !== pair[ch]) return false
            st.pop()
        } else st.push(ch)
    }
    return st.length === 0
}`,
    },
    explanation: `Открывающие скобки кладём в стек, закрывающая должна совпасть с вершиной. Две частые ошибки: не проверить пустой стек перед извлечением (\`"))"\`) и забыть проверить, что стек пуст в конце (\`"(("\`).

**Сложность:** O(n).`,
    hints: ['Какая структура данных помнит последнюю незакрытую скобку?'],
  },
  {
    id: 'daily-temperatures',
    title: 'Сколько ждать потепления',
    difficulty: 'medium',
    pattern: 'Стек и очередь',
    topic: 'algo-stack-queue',
    statement: `Дан массив температур по дням. Для каждого дня верните, через сколько дней станет строго теплее. Если такого дня нет — 0. Нужно O(n).`,
    fn: 'dailyTemperatures',
    params: ['t'],
    tests: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { args: [[30, 60, 90]], expected: [1, 1, 0] },
      { args: [[50, 50, 50]], expected: [0, 0, 0] },
      { args: [[]], expected: [] },
    ],
    solution: {
      py: `def dailyTemperatures(t):
    res = [0] * len(t)
    st = []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res`,
      js: `function dailyTemperatures(t) {
    const res = new Array(t.length).fill(0)
    const st = []
    for (let i = 0; i < t.length; i++) {
        while (st.length && t[st[st.length - 1]] < t[i]) {
            const j = st.pop()
            res[j] = i - j
        }
        st.push(i)
    }
    return res
}`,
    },
    explanation: `Монотонный стек индексов дней, для которых ещё не нашли более тёплый день; температуры в стеке не возрастают. Новый день «закрывает» все более холодные дни на вершине. Каждый индекс кладётся и снимается один раз.

**Сложность:** O(n).`,
    hints: ['Храните дни, для которых ответ ещё не найден.', 'Какой порядок температур будет в этом стеке?'],
  },
  {
    id: 'eval-rpn',
    title: 'Вычислить выражение в обратной польской записи',
    difficulty: 'medium',
    pattern: 'Стек и очередь',
    topic: 'algo-stack-queue',
    statement: `Вычислите выражение в обратной польской записи. Токены — целые числа и операторы \`+ - * /\`. Деление целочисленное с отбрасыванием дробной части **к нулю** (\`-7 / 2 = -3\`).

\`["2","1","+","3","*"]\` → 9.`,
    fn: 'evalRPN',
    params: ['tokens'],
    tests: [
      { args: [['2', '1', '+', '3', '*']], expected: 9 },
      { args: [['4', '13', '5', '/', '+']], expected: 6 },
      { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
      { args: [['-7', '2', '/']], expected: -3 },
      { args: [['42']], expected: 42 },
    ],
    solution: {
      py: `def evalRPN(tokens):
    st = []
    for tok in tokens:
        if tok in "+-*/" and len(tok) == 1:
            b = st.pop(); a = st.pop()
            if tok == "+": st.append(a + b)
            elif tok == "-": st.append(a - b)
            elif tok == "*": st.append(a * b)
            else: st.append(int(a / b))
        else:
            st.append(int(tok))
    return st[-1]`,
      js: `function evalRPN(tokens) {
    const st = []
    for (const tok of tokens) {
        if (['+', '-', '*', '/'].includes(tok)) {
            const b = st.pop(), a = st.pop()
            if (tok === '+') st.push(a + b)
            else if (tok === '-') st.push(a - b)
            else if (tok === '*') st.push(a * b)
            else st.push(Math.trunc(a / b))
        } else st.push(Number(tok))
    }
    return st[st.length - 1]
}`,
    },
    explanation: `Числа кладём в стек, оператор снимает два верхних и кладёт результат. Порядок операндов важен: сначала снимается правый. Ловушка — деление: в Python \`//\` округляет вниз (\`-7 // 2 = -4\`), нужен \`int(a / b)\`. Токен \`"-11"\` — число, а не минус.

**Сложность:** O(n).`,
    hints: ['Стек операндов.', 'Проверьте, как ваш язык делит отрицательные числа.'],
  },
  {
    id: 'simplify-path',
    title: 'Упростить путь Unix',
    difficulty: 'medium',
    pattern: 'Стек и очередь',
    topic: 'algo-stack-queue',
    statement: `Дан абсолютный путь в Unix. Приведите его к каноническому виду: \`.\` — текущая папка, \`..\` — родительская (из корня никуда не ведёт), несколько слешей подряд — один слеш, в конце слеша нет. Имена вроде \`...\` — обычные папки.`,
    fn: 'simplifyPath',
    params: ['path'],
    tests: [
      { args: ['/home/'], expected: '/home' },
      { args: ['/../'], expected: '/' },
      { args: ['/home//foo/'], expected: '/home/foo' },
      { args: ['/a/./b/../../c/'], expected: '/c' },
      { args: ['/.../a/../b'], expected: '/.../b' },
    ],
    solution: {
      py: `def simplifyPath(path):
    st = []
    for part in path.split("/"):
        if part == "..":
            if st:
                st.pop()
        elif part and part != ".":
            st.append(part)
    return "/" + "/".join(st)`,
      js: `function simplifyPath(path) {
    const st = []
    for (const part of path.split('/')) {
        if (part === '..') st.pop()
        else if (part && part !== '.') st.push(part)
    }
    return '/' + st.join('/')
}`,
    },
    explanation: `Разбиваем по \`/\`, пустые куски и \`.\` пропускаем, \`..\` снимает папку со стека (если стек пуст — ничего), остальное кладём. Ответ — слеш и склейка стека.

**Сложность:** O(n).`,
    hints: ['Разбейте путь по слешу и обработайте части.'],
  },
  {
    id: 'sliding-max',
    title: 'Максимум в скользящем окне',
    difficulty: 'hard',
    pattern: 'Стек и очередь',
    topic: 'algo-stack-queue',
    statement: `Для массива \`nums\` и окна размера \`k\` верните максимум каждого окна при его сдвиге слева направо. Нужно O(n).`,
    fn: 'maxSlidingWindow',
    params: ['nums', 'k'],
    tests: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
      { args: [[1, 2, 3, 4], 4], expected: [4] },
      { args: [[4, 4, 4, 1], 2], expected: [4, 4, 4] },
    ],
    solution: {
      py: `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    res = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res`,
      js: `function maxSlidingWindow(nums, k) {
    const dq = []
    let head = 0
    const res = []
    for (let i = 0; i < nums.length; i++) {
        while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop()
        dq.push(i)
        if (dq[head] <= i - k) head++
        if (i >= k - 1) res.push(nums[dq[head]])
    }
    return res
}`,
    },
    explanation: `Монотонный дек индексов с убывающими значениями. Новый элемент выталкивает с конца все, что не больше его — они уже никогда не станут максимумом. Слева удаляем индекс, вышедший из окна. Максимум текущего окна — голова дека.

В JS нет встроенного дека: \`shift()\` — O(n), поэтому держим индекс головы.

**Сложность:** O(n).`,
    hints: ['Какие элементы окна никогда не станут максимумом?', 'Храните кандидатов в порядке убывания.'],
  },
  {
    id: 'min-stack',
    title: 'Стек с минимумом за O(1)',
    difficulty: 'medium',
    pattern: 'Проектирование структур',
    topic: 'algo-stack-queue',
    statement: `Реализуйте стек с операциями \`push x\`, \`pop\`, \`top\`, \`getMin\` — все за O(1). Функция получает список операций вида \`["push", 5]\`, \`["pop"]\`, \`["top"]\`, \`["getMin"]\` и возвращает список результатов операций \`top\` и \`getMin\` в порядке выполнения. Гарантируется, что \`pop\`, \`top\` и \`getMin\` вызываются на непустом стеке.`,
    fn: 'runMinStack',
    params: ['ops'],
    tests: [
      { args: [[['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]], expected: [-3, 0, -2] },
      { args: [[['push', 1], ['getMin'], ['push', 1], ['pop'], ['getMin']]], expected: [1, 1] },
      { args: [[['push', 5], ['push', 3], ['push', 7], ['getMin'], ['pop'], ['pop'], ['getMin'], ['top']]], expected: [3, 5, 5] },
    ],
    solution: {
      py: `def runMinStack(ops):
    st = []  # пары (значение, минимум на этот момент)
    out = []
    for op in ops:
        if op[0] == "push":
            m = op[1] if not st else min(op[1], st[-1][1])
            st.append((op[1], m))
        elif op[0] == "pop":
            st.pop()
        elif op[0] == "top":
            out.append(st[-1][0])
        else:
            out.append(st[-1][1])
    return out`,
      js: `function runMinStack(ops) {
    const st = []
    const out = []
    for (const op of ops) {
        if (op[0] === 'push') st.push([op[1], st.length ? Math.min(op[1], st[st.length - 1][1]) : op[1]])
        else if (op[0] === 'pop') st.pop()
        else if (op[0] === 'top') out.push(st[st.length - 1][0])
        else out.push(st[st.length - 1][1])
    }
    return out
}`,
    },
    explanation: `Храним вместе с каждым элементом минимум стека на момент его добавления. Тогда при \`pop\` минимум «откатывается» автоматически, а \`getMin\` — это второе поле вершины. Альтернатива — отдельный стек минимумов.

**Сложность:** O(1) на операцию.`,
    hints: ['Что, если каждый элемент будет помнить минимум под собой?'],
  },
  {
    id: 'lru-cache',
    title: 'LRU-кэш',
    difficulty: 'medium',
    pattern: 'Проектирование структур',
    topic: 'algo-linked-list',
    statement: `Реализуйте LRU-кэш вместимостью \`capacity\` с операциями \`get key\` (вернуть значение или -1) и \`put key value\` (вставить/обновить; при переполнении вытеснить давно не использованный ключ). \`get\` и \`put\` считаются использованием ключа. Обе операции — O(1).

Функция получает вместимость и список операций \`["put", k, v]\` / \`["get", k]\` и возвращает список результатов всех \`get\`.`,
    fn: 'runLRU',
    params: ['capacity', 'ops'],
    tests: [
      { args: [2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]], expected: [1, -1, -1, 3, 4] },
      { args: [1, [['put', 2, 1], ['get', 2], ['put', 3, 2], ['get', 2], ['get', 3]]], expected: [1, -1, 2] },
      { args: [2, [['put', 2, 1], ['put', 2, 2], ['get', 2], ['put', 1, 1], ['put', 4, 1], ['get', 2]]], expected: [2, -1] },
    ],
    solution: {
      py: `from collections import OrderedDict

def runLRU(capacity, ops):
    cache = OrderedDict()
    out = []
    for op in ops:
        if op[0] == "get":
            k = op[1]
            if k in cache:
                cache.move_to_end(k)
                out.append(cache[k])
            else:
                out.append(-1)
        else:
            k, v = op[1], op[2]
            if k in cache:
                cache.move_to_end(k)
            cache[k] = v
            if len(cache) > capacity:
                cache.popitem(last=False)
    return out`,
      js: `function runLRU(capacity, ops) {
    // Map в JS помнит порядок вставки: удаление и повторная вставка переносят ключ в конец
    const cache = new Map()
    const out = []
    for (const op of ops) {
        if (op[0] === 'get') {
            if (!cache.has(op[1])) { out.push(-1); continue }
            const v = cache.get(op[1])
            cache.delete(op[1])
            cache.set(op[1], v)
            out.push(v)
        } else {
            cache.delete(op[1])
            cache.set(op[1], op[2])
            if (cache.size > capacity) cache.delete(cache.keys().next().value)
        }
    }
    return out
}`,
    },
    explanation: `Классическое устройство: хеш-таблица «ключ → узел» и двусвязный список в порядке использования. Использование переносит узел в голову, вытеснение удаляет хвост — всё O(1).

В Python это готовый \`OrderedDict\` с \`move_to_end\` и \`popitem(last=False)\`, в JS — \`Map\`, который помнит порядок вставки. На интервью часто просят реализовать список вручную — будьте готовы объяснить, что внутри.

**Сложность:** O(1) на операцию.`,
    hints: ['Нужны быстрый поиск по ключу и быстрый перенос в «свежий» конец.', 'Хеш-таблица + двусвязный список.'],
  },
  {
    id: 'cycle-start',
    title: 'Начало цикла в последовательности переходов',
    difficulty: 'medium',
    pattern: 'Два указателя',
    topic: 'algo-linked-list',
    statement: `Массив \`next\` задаёт переходы: из вершины \`i\` идём в \`next[i]\`. Начав с вершины 0, мы рано или поздно попадём в цикл. Верните номер вершины, с которой начинается цикл. Решите за O(1) доп. памяти (как поиск начала цикла в связном списке).`,
    fn: 'cycleStart',
    params: ['next'],
    tests: [
      { args: [[1, 2, 3, 4, 2]], expected: 2 },
      { args: [[0]], expected: 0 },
      { args: [[1, 0]], expected: 0 },
      { args: [[1, 2, 3, 3]], expected: 3 },
      { args: [[3, 0, 1, 4, 5, 6, 4]], expected: 4 },
    ],
    solution: {
      py: `def cycleStart(next):
    slow = fast = 0
    while True:
        slow = next[slow]
        fast = next[next[fast]]
        if slow == fast:
            break
    slow = 0
    while slow != fast:
        slow = next[slow]
        fast = next[fast]
    return slow`,
      js: `function cycleStart(next) {
    let slow = 0, fast = 0
    do {
        slow = next[slow]
        fast = next[next[fast]]
    } while (slow !== fast)
    slow = 0
    while (slow !== fast) {
        slow = next[slow]
        fast = next[fast]
    }
    return slow
}`,
    },
    explanation: `Алгоритм Флойда. Медленный указатель делает шаг, быстрый — два; внутри цикла они встретятся. Пусть до цикла \`a\` шагов, встреча произошла через \`b\` шагов внутри цикла длины \`c\`. Быстрый прошёл вдвое больше: \`2(a + b) = a + b + kc\`, откуда \`a = kc − b\`. Значит, если один указатель поставить в начало, а второй оставить в точке встречи и двигать оба по одному шагу, они сойдутся ровно в начале цикла.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Быстрый и медленный указатели.', 'После встречи верните один указатель в начало.'],
  },
  {
    id: 'subsets',
    title: 'Все подмножества',
    difficulty: 'medium',
    pattern: 'Перебор с возвратом',
    topic: 'algo-recursion',
    compare: 'unordered-nested',
    statement: `Дан массив различных чисел. Верните все его подмножества (включая пустое). Порядок подмножеств и чисел в них не важен.`,
    fn: 'subsets',
    params: ['nums'],
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [[0]], expected: [[], [0]] },
      { args: [[]], expected: [[]] },
    ],
    solution: {
      py: `def subsets(nums):
    res, cur = [], []
    def go(i):
        if i == len(nums):
            res.append(cur[:])
            return
        go(i + 1)
        cur.append(nums[i])
        go(i + 1)
        cur.pop()
    go(0)
    return res`,
      js: `function subsets(nums) {
    const res = [], cur = []
    const go = (i) => {
        if (i === nums.length) { res.push([...cur]); return }
        go(i + 1)
        cur.push(nums[i])
        go(i + 1)
        cur.pop()
    }
    go(0)
    return res
}`,
    },
    explanation: `Для каждого элемента два варианта: не брать или брать. Рекурсия глубины n строит все 2ⁿ комбинаций. После возврата из ветки «брать» откатываем изменение, а в ответ кладём **копию** текущего списка.

**Сложность:** O(2ⁿ · n).`,
    hints: ['Для каждого элемента решите: брать или не брать.'],
  },
  {
    id: 'permutations',
    title: 'Все перестановки',
    difficulty: 'medium',
    pattern: 'Перебор с возвратом',
    topic: 'algo-recursion',
    compare: 'unordered',
    statement: `Верните все перестановки массива различных чисел. Порядок перестановок не важен.`,
    fn: 'permute',
    params: ['nums'],
    tests: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]] },
      { args: [[1]], expected: [[1]] },
    ],
    solution: {
      py: `def permute(nums):
    res, cur, used = [], [], [False] * len(nums)
    def go():
        if len(cur) == len(nums):
            res.append(cur[:])
            return
        for i, x in enumerate(nums):
            if not used[i]:
                used[i] = True
                cur.append(x)
                go()
                cur.pop()
                used[i] = False
    go()
    return res`,
      js: `function permute(nums) {
    const res = [], cur = [], used = new Array(nums.length).fill(false)
    const go = () => {
        if (cur.length === nums.length) { res.push([...cur]); return }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue
            used[i] = true
            cur.push(nums[i])
            go()
            cur.pop()
            used[i] = false
        }
    }
    go()
    return res
}`,
    },
    explanation: `На каждой позиции перебираем ещё не использованные элементы, отмечаем, уходим глубже, откатываем. Всего n! перестановок.

**Сложность:** O(n! · n).`,
    hints: ['Отмечайте использованные элементы.'],
  },
  {
    id: 'generate-parentheses',
    title: 'Генерация скобочных последовательностей',
    difficulty: 'medium',
    pattern: 'Перебор с возвратом',
    topic: 'algo-recursion',
    compare: 'unordered',
    statement: `Сгенерируйте все правильные скобочные последовательности из \`n\` пар круглых скобок. Порядок не важен.`,
    fn: 'generateParenthesis',
    params: ['n'],
    tests: [
      { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { args: [1], expected: ['()'] },
      { args: [0], expected: [''] },
    ],
    solution: {
      py: `def generateParenthesis(n):
    res = []
    def go(s, open_, close):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_ < n:
            go(s + "(", open_ + 1, close)
        if close < open_:
            go(s + ")", open_, close + 1)
    go("", 0, 0)
    return res`,
      js: `function generateParenthesis(n) {
    const res = []
    const go = (s, open, close) => {
        if (s.length === 2 * n) { res.push(s); return }
        if (open < n) go(s + '(', open + 1, close)
        if (close < open) go(s + ')', open, close + 1)
    }
    go('', 0, 0)
    return res
}`,
    },
    explanation: `Строим строку символ за символом с двумя правилами: открывающую можно поставить, пока их меньше n; закрывающую — пока закрытых меньше открытых. Так генерируются только правильные последовательности, без проверки в конце. Их количество — число Каталана.

**Сложность:** O(Cₙ · n).`,
    hints: ['Когда можно поставить «(», а когда «)»?'],
  },
  {
    id: 'combination-sum',
    title: 'Комбинации с заданной суммой',
    difficulty: 'medium',
    pattern: 'Перебор с возвратом',
    topic: 'algo-recursion',
    compare: 'unordered-nested',
    statement: `Даны различные положительные числа \`candidates\` и \`target\`. Найдите все уникальные комбинации чисел с суммой \`target\`. Каждое число можно брать сколько угодно раз. Комбинации, отличающиеся только порядком, считаются одинаковыми.`,
    fn: 'combinationSum',
    params: ['candidates', 'target'],
    tests: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expected: [] },
    ],
    solution: {
      py: `def combinationSum(candidates, target):
    candidates.sort()
    res, cur = [], []
    def go(start, rest):
        if rest == 0:
            res.append(cur[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > rest:
                break
            cur.append(c)
            go(i, rest - c)
            cur.pop()
    go(0, target)
    return res`,
      js: `function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b)
    const res = [], cur = []
    const go = (start, rest) => {
        if (rest === 0) { res.push([...cur]); return }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > rest) break
            cur.push(candidates[i])
            go(i, rest - candidates[i])
            cur.pop()
        }
    }
    go(0, target)
    return res
}`,
    },
    explanation: `Чтобы не получать перестановки одной комбинации, выбираем элементы в неубывающем порядке индексов: рекурсия продолжает с того же \`i\` (можно повторять), но не возвращается к меньшим. Сортировка позволяет обрезать ветку, как только кандидат больше остатка.

**Сложность:** экспоненциальная от target / min(candidates).`,
    hints: ['Как избежать дубликатов вида [2,3,2] и [3,2,2]?', 'Передавайте индекс, с которого можно выбирать дальше.'],
  },
  {
    id: 'letter-combinations',
    title: 'Буквы телефонной клавиатуры',
    difficulty: 'medium',
    pattern: 'Перебор с возвратом',
    topic: 'algo-recursion',
    compare: 'unordered',
    statement: `Цифрам 2–9 соответствуют буквы, как на кнопочном телефоне (2 — abc, 3 — def, 4 — ghi, 5 — jkl, 6 — mno, 7 — pqrs, 8 — tuv, 9 — wxyz). Верните все строки, которые можно набрать данной последовательностью цифр. Для пустой строки — пустой список.`,
    fn: 'letterCombinations',
    params: ['digits'],
    tests: [
      { args: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { args: [''], expected: [] },
      { args: ['7'], expected: ['p', 'q', 'r', 's'] },
    ],
    solution: {
      py: `def letterCombinations(digits):
    if not digits:
        return []
    m = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
    res = [""]
    for d in digits:
        res = [p + ch for p in res for ch in m[d]]
    return res`,
      js: `function letterCombinations(digits) {
    if (!digits) return []
    const m = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' }
    let res = ['']
    for (const d of digits) res = res.flatMap((p) => [...m[d]].map((ch) => p + ch))
    return res
}`,
    },
    explanation: `Итеративное декартово произведение: для каждой следующей цифры дописываем все её буквы ко всем уже построенным префиксам. Рекурсивный вариант с возвратом эквивалентен. Не забудьте пустой ввод — должен быть пустой список, а не \`[""]\`.

**Сложность:** O(4ⁿ · n).`,
    hints: ['Постройте ответ по одной цифре за раз.'],
  },
  {
    id: 'max-depth',
    title: 'Глубина двоичного дерева',
    difficulty: 'easy',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Найдите максимальную глубину двоичного дерева — число узлов на самом длинном пути от корня до листа.${TREE_NOTE}`,
    fn: 'maxDepth',
    params: ['root'],
    tests: [
      { args: [T(3, T(9), T(20, T(15), T(7)))], expected: 3 },
      { args: [T(1, null, T(2))], expected: 2 },
      { args: [null], expected: 0 },
      { args: [T(1, T(2, T(3, T(4))))], expected: 4 },
    ],
    solution: {
      py: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root["left"]), maxDepth(root["right"]))`,
      js: `function maxDepth(root) {
    if (!root) return 0
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}`,
    },
    explanation: `Глубина дерева = 1 + максимум глубин поддеревьев; у пустого дерева — 0. Итеративно — BFS по уровням со счётчиком уровней.

**Сложность:** O(n) времени, O(h) памяти на стек.`,
    hints: ['Выразите ответ через ответы для поддеревьев.'],
  },
  {
    id: 'invert-tree',
    title: 'Зеркально отразить дерево',
    difficulty: 'easy',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Отразите двоичное дерево: у каждого узла поменяйте местами левого и правого ребёнка. Верните корень.${TREE_NOTE}`,
    fn: 'invertTree',
    params: ['root'],
    tests: [
      { args: [T(4, T(2, T(1), T(3)), T(7, T(6), T(9)))], expected: T(4, T(7, T(9), T(6)), T(2, T(3), T(1))) },
      { args: [T(2, T(1), T(3))], expected: T(2, T(3), T(1)) },
      { args: [null], expected: null },
    ],
    solution: {
      py: `def invertTree(root):
    if root:
        root["left"], root["right"] = invertTree(root["right"]), invertTree(root["left"])
    return root`,
      js: `function invertTree(root) {
    if (root) [root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
    return root
}`,
    },
    explanation: `Рекурсивно отражаем поддеревья и меняем их местами. Порядок обхода не важен — прямой, обратный или BFS работают одинаково.

**Сложность:** O(n).`,
    hints: ['Что нужно сделать с одним узлом и его детьми?'],
  },
  {
    id: 'valid-bst',
    title: 'Проверка дерева поиска',
    difficulty: 'medium',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Проверьте, является ли двоичное дерево деревом поиска: для каждого узла все значения левого поддерева **строго меньше**, а правого — **строго больше** значения узла.${TREE_NOTE}`,
    fn: 'isValidBST',
    params: ['root'],
    tests: [
      { args: [T(2, T(1), T(3))], expected: true },
      { args: [T(5, T(1), T(4, T(3), T(6)))], expected: false },
      { args: [T(5, T(4), T(6, T(3), T(7)))], expected: false },
      { args: [null], expected: true },
      { args: [T(2, T(2), T(2))], expected: false },
      { args: [T(10, T(5, T(1), T(8)), T(15, T(12), T(20)))], expected: true },
    ],
    solution: {
      py: `def isValidBST(root):
    def ok(node, lo, hi):
        if not node:
            return True
        v = node["val"]
        if not (lo < v < hi):
            return False
        return ok(node["left"], lo, v) and ok(node["right"], v, hi)
    return ok(root, float("-inf"), float("inf"))`,
      js: `function isValidBST(root) {
    const ok = (node, lo, hi) => {
        if (!node) return true
        if (!(lo < node.val && node.val < hi)) return false
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi)
    }
    return ok(root, -Infinity, Infinity)
}`,
    },
    explanation: `Передаём вниз допустимый интервал значений. Проверять только прямых детей недостаточно: в третьем тесте 3 — правый потомок 6, но находится в правом поддереве 5, где всё должно быть больше 5.

**Сложность:** O(n).`,
    hints: ['Какой диапазон значений допустим для каждого узла?'],
  },
  {
    id: 'level-order',
    title: 'Обход по уровням',
    difficulty: 'medium',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Верните значения узлов дерева по уровням: список списков, каждый уровень слева направо.${TREE_NOTE}`,
    fn: 'levelOrder',
    params: ['root'],
    tests: [
      { args: [T(3, T(9), T(20, T(15), T(7)))], expected: [[3], [9, 20], [15, 7]] },
      { args: [T(1)], expected: [[1]] },
      { args: [null], expected: [] },
      { args: [T(1, T(2, T(4)), T(3, null, T(5)))], expected: [[1], [2, 3], [4, 5]] },
    ],
    solution: {
      py: `from collections import deque

def levelOrder(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node["val"])
            for ch in (node["left"], node["right"]):
                if ch:
                    q.append(ch)
        res.append(level)
    return res`,
      js: `function levelOrder(root) {
    if (!root) return []
    const res = []
    let level = [root]
    while (level.length) {
        res.push(level.map((n) => n.val))
        level = level.flatMap((n) => [n.left, n.right].filter(Boolean))
    }
    return res
}`,
    },
    explanation: `BFS: в начале каждой итерации в очереди лежит ровно один уровень. Фиксируем его размер, обрабатываем ровно столько узлов, добавляя детей для следующего уровня.

**Сложность:** O(n).`,
    hints: ['Очередь и размер уровня.'],
  },
  {
    id: 'lca-bst',
    title: 'Общий предок в дереве поиска',
    difficulty: 'medium',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Дано двоичное дерево поиска и два значения \`p\` и \`q\`, которые в нём есть. Верните значение их наименьшего общего предка — самого глубокого узла, в поддереве которого есть оба (узел может быть предком самого себя).${TREE_NOTE}`,
    fn: 'lcaBST',
    params: ['root', 'p', 'q'],
    tests: [
      { args: [T(6, T(2, T(0), T(4, T(3), T(5))), T(8, T(7), T(9))), 2, 8], expected: 6 },
      { args: [T(6, T(2, T(0), T(4, T(3), T(5))), T(8, T(7), T(9))), 2, 4], expected: 2 },
      { args: [T(2, T(1)), 2, 1], expected: 2 },
      { args: [T(6, T(2, T(0), T(4, T(3), T(5))), T(8, T(7), T(9))), 3, 5], expected: 4 },
    ],
    solution: {
      py: `def lcaBST(root, p, q):
    node = root
    while node:
        if p < node["val"] and q < node["val"]:
            node = node["left"]
        elif p > node["val"] and q > node["val"]:
            node = node["right"]
        else:
            return node["val"]`,
      js: `function lcaBST(root, p, q) {
    let node = root
    while (node) {
        if (p < node.val && q < node.val) node = node.left
        else if (p > node.val && q > node.val) node = node.right
        else return node.val
    }
}`,
    },
    explanation: `В дереве поиска можно идти от корня по значениям: если оба меньше узла — предок слева, оба больше — справа. Как только значения «разошлись» (или одно совпало с узлом) — это и есть наименьший общий предок.

Для обычного дерева нужна рекурсия «нашли ли в левом/правом поддереве» за O(n).

**Сложность:** O(h).`,
    hints: ['Используйте свойство дерева поиска.'],
  },
  {
    id: 'diameter',
    title: 'Диаметр дерева',
    difficulty: 'medium',
    pattern: 'Деревья',
    topic: 'algo-trees',
    statement: `Диаметр двоичного дерева — число **рёбер** на самом длинном пути между двумя любыми узлами. Путь не обязан проходить через корень.${TREE_NOTE}`,
    fn: 'diameter',
    params: ['root'],
    tests: [
      { args: [T(1, T(2, T(4), T(5)), T(3))], expected: 3 },
      { args: [T(1, T(2))], expected: 1 },
      { args: [null], expected: 0 },
      { args: [T(1, T(2, T(3, T(4)), T(5, null, T(6, null, T(7)))), T(8))], expected: 5 },
    ],
    solution: {
      py: `def diameter(root):
    best = 0
    def h(node):
        nonlocal best
        if not node:
            return 0
        l, r = h(node["left"]), h(node["right"])
        best = max(best, l + r)
        return 1 + max(l, r)
    h(root)
    return best`,
      js: `function diameter(root) {
    let best = 0
    const h = (node) => {
        if (!node) return 0
        const l = h(node.left), r = h(node.right)
        best = Math.max(best, l + r)
        return 1 + Math.max(l, r)
    }
    h(root)
    return best
}`,
    },
    explanation: `Самый длинный путь через узел = высота левого поддерева + высота правого (в рёбрах). Считаем высоты обратным обходом и попутно обновляем глобальный максимум. Последний тест показывает, почему путь не обязан проходить через корень.

**Сложность:** O(n).`,
    hints: ['Какой самый длинный путь проходит через данный узел?'],
  },
  {
    id: 'num-islands',
    title: 'Количество островов',
    difficulty: 'medium',
    pattern: 'Графы',
    topic: 'algo-graphs',
    statement: `Карта задана списком строк из символов \`1\` (суша) и \`0\` (вода). Остров — группа суши, соединённой по горизонтали или вертикали. Посчитайте острова.`,
    fn: 'numIslands',
    params: ['grid'],
    tests: [
      { args: [['11110', '11010', '11000', '00000']], expected: 1 },
      { args: [['11000', '11000', '00100', '00011']], expected: 3 },
      { args: [['0']], expected: 0 },
      { args: [['101', '010', '101']], expected: 5 },
      { args: [[]], expected: 0 },
    ],
    solution: {
      py: `from collections import deque

def numIslands(grid):
    if not grid:
        return 0
    n, m = len(grid), len(grid[0])
    seen = [[False] * m for _ in range(n)]
    count = 0
    for i in range(n):
        for j in range(m):
            if grid[i][j] == "1" and not seen[i][j]:
                count += 1
                seen[i][j] = True
                q = deque([(i, j)])
                while q:
                    x, y = q.popleft()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        a, b = x + dx, y + dy
                        if 0 <= a < n and 0 <= b < m and grid[a][b] == "1" and not seen[a][b]:
                            seen[a][b] = True
                            q.append((a, b))
    return count`,
      js: `function numIslands(grid) {
    if (!grid.length) return 0
    const n = grid.length, m = grid[0].length
    const seen = Array.from({ length: n }, () => new Array(m).fill(false))
    let count = 0
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
        if (grid[i][j] !== '1' || seen[i][j]) continue
        count++
        seen[i][j] = true
        const q = [[i, j]]
        while (q.length) {
            const [x, y] = q.pop()
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const a = x + dx, b = y + dy
                if (a >= 0 && a < n && b >= 0 && b < m && grid[a][b] === '1' && !seen[a][b]) {
                    seen[a][b] = true
                    q.push([a, b])
                }
            }
        }
    }
    return count
}`,
    },
    explanation: `Каждая непосещённая клетка суши начинает новый остров: запускаем обход (BFS или DFS со стеком) и помечаем всю сушу острова. Рекурсивный DFS на больших картах может переполнить стек — явная очередь или стек надёжнее.

**Сложность:** O(n · m).`,
    hints: ['Сколько раз нужно запустить обход?'],
  },
  {
    id: 'course-schedule',
    title: 'Можно ли пройти все курсы',
    difficulty: 'medium',
    pattern: 'Графы',
    topic: 'algo-graphs',
    statement: `Есть \`n\` курсов (0…n−1) и список зависимостей \`[a, b]\`: чтобы пройти \`a\`, нужно сначала пройти \`b\`. Можно ли пройти все курсы?`,
    fn: 'canFinish',
    params: ['n', 'prerequisites'],
    tests: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false },
      { args: [3, []], expected: true },
      { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false },
      { args: [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]], expected: true },
    ],
    solution: {
      py: `from collections import deque

def canFinish(n, prerequisites):
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prerequisites:
        g[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    done = 0
    while q:
        v = q.popleft()
        done += 1
        for u in g[v]:
            indeg[u] -= 1
            if indeg[u] == 0:
                q.append(u)
    return done == n`,
      js: `function canFinish(n, prerequisites) {
    const g = Array.from({ length: n }, () => [])
    const indeg = new Array(n).fill(0)
    for (const [a, b] of prerequisites) { g[b].push(a); indeg[a]++ }
    const q = []
    for (let i = 0; i < n; i++) if (!indeg[i]) q.push(i)
    let done = 0
    while (q.length) {
        const v = q.pop()
        done++
        for (const u of g[v]) if (--indeg[u] === 0) q.push(u)
    }
    return done === n
}`,
    },
    explanation: `Курсы и зависимости — ориентированный граф. Пройти всё можно, если в нём нет цикла. Алгоритм Кана: берём курсы без невыполненных зависимостей, «проходим» их и уменьшаем входящие степени последователей. Если обработали не все курсы — остались вершины в цикле.

**Сложность:** O(V + E).`,
    hints: ['Сформулируйте задачу на языке графов.', 'С каких курсов можно начать?'],
  },
  {
    id: 'shortest-path-grid',
    title: 'Кратчайший путь в лабиринте',
    difficulty: 'medium',
    pattern: 'Графы',
    topic: 'algo-graphs',
    statement: `Лабиринт задан строками: \`.\` — проход, \`#\` — стена, \`S\` — старт, \`E\` — выход. Ходить можно на соседнюю клетку по горизонтали или вертикали. Верните минимальное число шагов от \`S\` до \`E\` или -1, если выход недостижим.`,
    fn: 'shortestPath',
    params: ['maze'],
    tests: [
      { args: [['S.#', '..#', '#.E']], expected: 4 },
      { args: [['S#E']], expected: -1 },
      { args: [['SE']], expected: 1 },
      { args: [['S....', '####.', 'E....']], expected: 10 },
    ],
    solution: {
      py: `from collections import deque

def shortestPath(maze):
    n, m = len(maze), len(maze[0])
    for i in range(n):
        for j in range(m):
            if maze[i][j] == "S":
                start = (i, j)
    dist = {start: 0}
    q = deque([start])
    while q:
        x, y = q.popleft()
        if maze[x][y] == "E":
            return dist[(x, y)]
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            a, b = x + dx, y + dy
            if 0 <= a < n and 0 <= b < m and maze[a][b] != "#" and (a, b) not in dist:
                dist[(a, b)] = dist[(x, y)] + 1
                q.append((a, b))
    return -1`,
      js: `function shortestPath(maze) {
    const n = maze.length, m = maze[0].length
    let start
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (maze[i][j] === 'S') start = [i, j]
    const dist = Array.from({ length: n }, () => new Array(m).fill(-1))
    dist[start[0]][start[1]] = 0
    const q = [start]
    for (let h = 0; h < q.length; h++) {
        const [x, y] = q[h]
        if (maze[x][y] === 'E') return dist[x][y]
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const a = x + dx, b = y + dy
            if (a >= 0 && a < n && b >= 0 && b < m && maze[a][b] !== '#' && dist[a][b] === -1) {
                dist[a][b] = dist[x][y] + 1
                q.push([a, b])
            }
        }
    }
    return -1
}`,
    },
    explanation: `Все шаги стоят одинаково, поэтому кратчайший путь ищется BFS. Помечаем клетку посещённой в момент добавления в очередь, а не извлечения — иначе одна клетка попадёт в очередь много раз.

**Сложность:** O(n · m).`,
    hints: ['Граф невзвешенный — какой обход даёт кратчайшие расстояния?'],
  },
  {
    id: 'network-delay',
    title: 'Время распространения сигнала',
    difficulty: 'medium',
    pattern: 'Графы',
    topic: 'algo-graphs',
    statement: `Сеть из \`n\` узлов (1…n) и направленные рёбра \`[u, v, w]\` — сигнал идёт из \`u\` в \`v\` за время \`w ≥ 0\`. Сигнал отправили из узла \`k\`. За какое время он дойдёт до всех узлов? Если до какого-то не дойдёт — верните -1.`,
    fn: 'networkDelayTime',
    params: ['times', 'n', 'k'],
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
      { args: [[[1, 2, 1]], 2, 1], expected: 1 },
      { args: [[[1, 2, 1]], 2, 2], expected: -1 },
      { args: [[[1, 2, 5], [1, 3, 1], [3, 2, 1]], 3, 1], expected: 2 },
    ],
    solution: {
      py: `import heapq

def networkDelayTime(times, n, k):
    g = [[] for _ in range(n + 1)]
    for u, v, w in times:
        g[u].append((v, w))
    dist = [float("inf")] * (n + 1)
    dist[k] = 0
    heap = [(0, k)]
    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:
            continue
        for u, w in g[v]:
            if d + w < dist[u]:
                dist[u] = d + w
                heapq.heappush(heap, (dist[u], u))
    ans = max(dist[1:])
    return ans if ans < float("inf") else -1`,
      js: `function networkDelayTime(times, n, k) {
    const g = Array.from({ length: n + 1 }, () => [])
    for (const [u, v, w] of times) g[u].push([v, w])
    const dist = new Array(n + 1).fill(Infinity)
    dist[k] = 0
    const done = new Array(n + 1).fill(false)
    // n небольшое: выбираем ближайшую необработанную вершину линейным поиском, O(n²)
    for (let it = 0; it < n; it++) {
        let v = -1
        for (let i = 1; i <= n; i++) if (!done[i] && (v === -1 || dist[i] < dist[v])) v = i
        if (dist[v] === Infinity) break
        done[v] = true
        for (const [u, w] of g[v]) dist[u] = Math.min(dist[u], dist[v] + w)
    }
    const ans = Math.max(...dist.slice(1))
    return ans === Infinity ? -1 : ans
}`,
    },
    explanation: `Кратчайшие пути от одного источника с неотрицательными весами — алгоритм Дейкстры. Ответ — максимум расстояний: сигнал дошёл до всех, когда дошёл до самого дальнего. С кучей — O((V + E) log V); вариант с линейным поиском минимума — O(V²), удобен для плотных графов и в языках без встроенной кучи (JS).

Проверка \`d > dist[v]\` отбрасывает устаревшие записи в куче.

**Сложность:** O((V + E) log V).`,
    hints: ['Какой алгоритм ищет кратчайшие пути при неотрицательных весах?', 'Сигнал дошёл до всех, когда дошёл до самого дальнего.'],
  },
  {
    id: 'count-components',
    title: 'Число компонент связности',
    difficulty: 'medium',
    pattern: 'Графы',
    topic: 'algo-graphs',
    statement: `Дано \`n\` вершин (0…n−1) и список неориентированных рёбер. Посчитайте количество компонент связности. Попробуйте решить через систему непересекающихся множеств (DSU).`,
    fn: 'countComponents',
    params: ['n', 'edges'],
    tests: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
      { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
      { args: [3, []], expected: 3 },
      { args: [4, [[0, 1], [1, 0], [2, 2]]], expected: 3 },
    ],
    solution: {
      py: `def countComponents(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    comps = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            comps -= 1
    return comps`,
      js: `function countComponents(n, edges) {
    const parent = Array.from({ length: n }, (_, i) => i)
    const find = (x) => {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] }
        return x
    }
    let comps = n
    for (const [a, b] of edges) {
        const ra = find(a), rb = find(b)
        if (ra !== rb) { parent[ra] = rb; comps-- }
    }
    return comps
}`,
    },
    explanation: `Начинаем с n отдельных компонент. Каждое ребро между разными компонентами объединяет их и уменьшает счётчик. \`find\` со сжатием пути (здесь — «половинным») делает операции почти O(1). Петли и повторные рёбра корректно игнорируются.

**Сложность:** O(E · α(n)).`,
    hints: ['Сколько компонент изначально и что делает каждое «полезное» ребро?'],
  },
  {
    id: 'kth-largest',
    title: 'k-й по величине элемент',
    difficulty: 'medium',
    pattern: 'Куча',
    topic: 'algo-heap',
    statement: `Найдите k-й по величине элемент массива (не k-й уникальный). Попробуйте решить быстрее полной сортировки.`,
    fn: 'findKthLargest',
    params: ['nums', 'k'],
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
      { args: [[-1, -1], 2], expected: -1 },
    ],
    solution: {
      py: `import heapq

def findKthLargest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      js: `function findKthLargest(nums, k) {
    // quickselect: ищем элемент, который встал бы на позицию n - k после сортировки
    const a = [...nums]
    const target = a.length - k
    let lo = 0, hi = a.length - 1
    while (true) {
        const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))]
        let i = lo, lt = lo, gt = hi
        while (i <= gt) {
            if (a[i] < pivot) [a[i++], a[lt++]] = [a[lt], a[i]]
            else if (a[i] > pivot) [a[i], a[gt--]] = [a[gt], a[i]]
            else i++
        }
        if (target < lt) hi = lt - 1
        else if (target > gt) lo = gt + 1
        else return pivot
    }
}`,
    },
    explanation: `Два стандартных подхода:
- **Min-куча размера k** — после прохода в ней k наибольших, а её вершина — k-й по величине. O(n log k), работает на потоке.
- **Quickselect** — разбиение как в quicksort, но рекурсия только в нужную часть. O(n) в среднем. Трёхпутевое разбиение спасает на массивах с повторами.

**Сложность:** O(n log k) или O(n) в среднем.`,
    hints: ['Держите k наибольших увиденных элементов.'],
  },
  {
    id: 'merge-k-sorted',
    title: 'Слияние k отсортированных массивов',
    difficulty: 'hard',
    pattern: 'Куча',
    topic: 'algo-heap',
    statement: `Дан список из \`k\` отсортированных массивов, всего N элементов. Верните один отсортированный массив за O(N log k).`,
    fn: 'mergeKSorted',
    params: ['lists'],
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expected: [] },
      { args: [[[], [1]]], expected: [1] },
      { args: [[[5], [1, 2, 3], [], [0, 10]]], expected: [0, 1, 2, 3, 5, 10] },
    ],
    solution: {
      py: `import heapq

def mergeKSorted(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    out = []
    while heap:
        v, i, j = heapq.heappop(heap)
        out.append(v)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out`,
      js: `function mergeKSorted(lists) {
    // попарное слияние по схеме «турнира»: log k раундов, в каждом O(N) работы
    const merge = (a, b) => {
        const out = []
        let i = 0, j = 0
        while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++])
        return out.concat(a.slice(i), b.slice(j))
    }
    let cur = lists.filter((l) => l.length)
    if (!cur.length) return []
    while (cur.length > 1) {
        const next = []
        for (let i = 0; i < cur.length; i += 2) next.push(i + 1 < cur.length ? merge(cur[i], cur[i + 1]) : cur[i])
        cur = next
    }
    return cur[0]
}`,
    },
    explanation: `Куча хранит по одному «текущему» элементу из каждого массива. Достаём минимальный, добавляем следующий элемент из того же массива. Размер кучи ≤ k, операций N — итого O(N log k). В кортеж добавлен индекс массива, чтобы при равных значениях сравнение не падало.

Альтернатива без кучи — попарное слияние по раундам, как в mergesort: log k раундов по O(N).

**Сложность:** O(N log k).`,
    hints: ['Какой элемент может быть следующим в ответе?', 'Кандидатов всего k — по одному из каждого массива.'],
  },
  {
    id: 'meeting-rooms-ii',
    title: 'Минимум переговорных',
    difficulty: 'medium',
    pattern: 'Куча',
    topic: 'algo-heap',
    statement: `Даны встречи \`[start, end)\`. Какое минимальное число переговорных нужно, чтобы провести все? Встреча, закончившаяся в момент \`t\`, освобождает комнату для встречи, начинающейся в \`t\`.`,
    fn: 'minMeetingRooms',
    params: ['intervals'],
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
      { args: [[[7, 10], [2, 4]]], expected: 1 },
      { args: [[[1, 5], [5, 10], [10, 15]]], expected: 1 },
      { args: [[[1, 10], [2, 9], [3, 8], [4, 7]]], expected: 4 },
      { args: [[]], expected: 0 },
    ],
    solution: {
      py: `import heapq

def minMeetingRooms(intervals):
    intervals.sort()
    ends = []
    best = 0
    for s, e in intervals:
        if ends and ends[0] <= s:
            heapq.heappop(ends)
        heapq.heappush(ends, e)
        best = max(best, len(ends))
    return best`,
      js: `function minMeetingRooms(intervals) {
    const starts = intervals.map((x) => x[0]).sort((a, b) => a - b)
    const ends = intervals.map((x) => x[1]).sort((a, b) => a - b)
    let rooms = 0, best = 0, j = 0
    for (let i = 0; i < starts.length; i++) {
        while (j < ends.length && ends[j] <= starts[i]) { j++; rooms-- }
        rooms++
        best = Math.max(best, rooms)
    }
    return best
}`,
    },
    explanation: `Сортируем по началу и держим min-кучу времён окончания занятых комнат. Если самая рано освобождающаяся комната свободна к началу встречи — используем её. Ответ — максимальный размер кучи.

Вариант без кучи: отдельно отсортировать начала и концы и идти двумя указателями, считая число одновременных встреч.

**Сложность:** O(n log n).`,
    hints: ['Какая из занятых комнат освободится раньше всех?'],
  },
  {
    id: 'median-stream',
    title: 'Медиана потока',
    difficulty: 'hard',
    pattern: 'Куча',
    topic: 'algo-heap',
    compare: 'float',
    statement: `Числа приходят по одному. После каждого добавления нужно знать медиану всех полученных чисел (для чётного количества — среднее двух средних). Функция получает список чисел и возвращает список медиан после каждого добавления. Каждое добавление — O(log n).`,
    fn: 'runningMedian',
    params: ['nums'],
    tests: [
      { args: [[5, 15, 1, 3]], expected: [5, 10, 5, 4] },
      { args: [[1, 2, 3, 4, 5]], expected: [1, 1.5, 2, 2.5, 3] },
      { args: [[2]], expected: [2] },
      { args: [[-1, -2, -3]], expected: [-1, -1.5, -2] },
    ],
    solution: {
      py: `import heapq

def runningMedian(nums):
    low, high = [], []  # low — max-куча (храним с минусом), high — min-куча
    out = []
    for x in nums:
        heapq.heappush(low, -x)
        heapq.heappush(high, -heapq.heappop(low))
        if len(high) > len(low):
            heapq.heappush(low, -heapq.heappop(high))
        out.append(-low[0] if len(low) > len(high) else (-low[0] + high[0]) / 2)
    return out`,
      js: `function runningMedian(nums) {
    // сортированный массив с бинарной вставкой: O(n) на вставку, но простой и понятный вариант для JS без кучи
    const a = []
    const out = []
    for (const x of nums) {
        let lo = 0, hi = a.length
        while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m }
        a.splice(lo, 0, x)
        const n = a.length
        out.push(n % 2 ? a[n >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2)
    }
    return out
}`,
    },
    explanation: `Две кучи делят числа пополам: max-куча для меньшей половины и min-куча для большей. Инвариант: все числа в нижней ≤ всех в верхней, размеры отличаются не больше чем на 1 (нижняя может быть больше). Новое число проталкиваем через обе кучи и балансируем. Медиана — вершина нижней или среднее двух вершин.

В JS нет встроенной кучи; решение с бинарной вставкой в отсортированный массив проще, но O(n) на вставку — на интервью скажите об этом и предложите реализовать кучу.

**Сложность:** O(log n) на добавление, O(1) на медиану.`,
    hints: ['Разделите числа на меньшую и большую половины.', 'Какие структуры быстро дают максимум меньшей половины и минимум большей?'],
  },
  {
    id: 'climb-stairs',
    title: 'Лестница',
    difficulty: 'easy',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `За один шаг можно подняться на 1 или 2 ступеньки. Сколькими способами можно подняться на \`n\`-ю ступеньку? (\`n ≥ 1\`)`,
    fn: 'climbStairs',
    params: ['n'],
    tests: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [1], expected: 1 },
      { args: [10], expected: 89 },
      { args: [45], expected: 1836311903 },
    ],
    solution: {
      py: `def climbStairs(n):
    a, b = 1, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b`,
      js: `function climbStairs(n) {
    let a = 1, b = 1
    for (let i = 1; i < n; i++) [a, b] = [b, a + b]
    return b
}`,
    },
    explanation: `На ступеньку \`i\` можно прийти с \`i−1\` или \`i−2\`, поэтому \`dp[i] = dp[i−1] + dp[i−2]\` — числа Фибоначчи. Хранить весь массив не нужно, достаточно двух последних значений. Наивная рекурсия без мемоизации на n = 45 не уложится во время.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Откуда можно прийти на ступеньку i?'],
  },
  {
    id: 'house-robber',
    title: 'Грабитель на улице',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Дома стоят в ряд, в каждом лежит сумма \`nums[i]\`. Нельзя грабить два соседних дома. Какую максимальную сумму можно унести?`,
    fn: 'rob',
    params: ['nums'],
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[]], expected: 0 },
      { args: [[5]], expected: 5 },
      { args: [[2, 1, 1, 2]], expected: 4 },
    ],
    solution: {
      py: `def rob(nums):
    prev, cur = 0, 0
    for x in nums:
        prev, cur = cur, max(cur, prev + x)
    return cur`,
      js: `function rob(nums) {
    let prev = 0, cur = 0
    for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)]
    return cur
}`,
    },
    explanation: `\`dp[i]\` — лучшая сумма на первых \`i\` домах. Либо не грабим дом \`i\` (\`dp[i−1]\`), либо грабим и прибавляем к \`dp[i−2]\`. Жадный выбор «через один» не работает — см. тест \`[2, 1, 1, 2]\`.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Для каждого дома два варианта: грабить или нет.'],
  },
  {
    id: 'coin-change',
    title: 'Размен монет',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Даны номиналы монет (каждой — бесконечно много) и сумма \`amount\`. Найдите минимальное число монет, которыми её можно набрать, или -1, если нельзя.`,
    fn: 'coinChange',
    params: ['coins', 'amount'],
    tests: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[1, 3, 4], 6], expected: 2 },
      { args: [[186, 419, 83, 408], 6249], expected: 20 },
    ],
    solution: {
      py: `def coinChange(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for s in range(1, amount + 1):
        for c in coins:
            if c <= s and dp[s - c] + 1 < dp[s]:
                dp[s] = dp[s - c] + 1
    return dp[amount] if dp[amount] != INF else -1`,
      js: `function coinChange(coins, amount) {
    const INF = amount + 1
    const dp = new Array(amount + 1).fill(INF)
    dp[0] = 0
    for (let s = 1; s <= amount; s++) {
        for (const c of coins) if (c <= s && dp[s - c] + 1 < dp[s]) dp[s] = dp[s - c] + 1
    }
    return dp[amount] === INF ? -1 : dp[amount]
}`,
    },
    explanation: `\`dp[s]\` — минимум монет для суммы \`s\`: перебираем последнюю монету \`c\` и берём \`dp[s − c] + 1\`. Жадный алгоритм «самая крупная монета» ошибается: для \`[1, 3, 4]\` и 6 он даст 4+1+1, а оптимально 3+3.

**Сложность:** O(amount · k).`,
    hints: ['Жадность не работает — проверьте на монетах 1, 3, 4 и сумме 6.', 'Какой могла быть последняя монета?'],
  },
  {
    id: 'lis',
    title: 'Наибольшая возрастающая подпоследовательность',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Найдите длину наибольшей строго возрастающей подпоследовательности (элементы не обязаны идти подряд). Попробуйте решить за O(n log n).`,
    fn: 'lengthOfLIS',
    params: ['nums'],
    tests: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { args: [[7, 7, 7, 7]], expected: 1 },
      { args: [[]], expected: 0 },
      { args: [[4, 10, 4, 3, 8, 9]], expected: 3 },
    ],
    solution: {
      py: `from bisect import bisect_left

def lengthOfLIS(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
      js: `function lengthOfLIS(nums) {
    const tails = []
    for (const x of nums) {
        let lo = 0, hi = tails.length
        while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m }
        tails[lo] = x
    }
    return tails.length
}`,
    },
    explanation: `\`tails[k]\` — минимальный возможный последний элемент возрастающей подпоследовательности длины \`k + 1\`. Массив \`tails\` отсортирован, поэтому место для нового элемента ищется бинпоиском: заменяем первый элемент ≥ x или дописываем в конец. Длина \`tails\` — ответ (сам \`tails\` при этом не обязан быть подпоследовательностью).

Решение за O(n²): \`dp[i] = 1 + max(dp[j])\` по всем \`j < i\` с \`nums[j] < nums[i]\`.

**Сложность:** O(n log n).`,
    hints: ['Для каждой длины храните наименьший возможный последний элемент.', 'Этот массив отсортирован — чем это помогает?'],
  },
  {
    id: 'edit-distance',
    title: 'Редакционное расстояние',
    difficulty: 'hard',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Найдите минимальное число операций (вставка, удаление, замена символа), чтобы превратить строку \`a\` в строку \`b\` (расстояние Левенштейна).`,
    fn: 'minDistance',
    params: ['a', 'b'],
    tests: [
      { args: ['horse', 'ros'], expected: 3 },
      { args: ['intention', 'execution'], expected: 5 },
      { args: ['', 'abc'], expected: 3 },
      { args: ['same', 'same'], expected: 0 },
      { args: ['кот', 'скот'], expected: 1 },
    ],
    solution: {
      py: `def minDistance(a, b):
    n, m = len(a), len(b)
    prev = list(range(m + 1))
    for i in range(1, n + 1):
        cur = [i] + [0] * m
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    return prev[m]`,
      js: `function minDistance(a, b) {
    const n = a.length, m = b.length
    let prev = Array.from({ length: m + 1 }, (_, j) => j)
    for (let i = 1; i <= n; i++) {
        const cur = [i]
        for (let j = 1; j <= m; j++) {
            cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1])
        }
        prev = cur
    }
    return prev[m]
}`,
    },
    explanation: `\`dp[i][j]\` — расстояние между префиксами \`a[:i]\` и \`b[:j]\`. Если последние символы равны — \`dp[i−1][j−1]\`. Иначе 1 + минимум из удаления (\`dp[i−1][j]\`), вставки (\`dp[i][j−1]\`) и замены (\`dp[i−1][j−1]\`). База: преобразование в пустую строку и из неё. Каждая строка таблицы зависит только от предыдущей — храним две.

**Сложность:** O(n · m) времени, O(m) памяти.`,
    hints: ['Состояние — пара префиксов.', 'Что можно сделать с последним символом?'],
  },
  {
    id: 'unique-paths',
    title: 'Пути в сетке с препятствиями',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Сетка задана матрицей из 0 (свободно) и 1 (препятствие). Робот стартует в левом верхнем углу и идёт только вправо или вниз. Сколько существует путей в правый нижний угол?`,
    fn: 'uniquePaths',
    params: ['grid'],
    tests: [
      { args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: 2 },
      { args: [[[0, 1], [0, 0]]], expected: 1 },
      { args: [[[1]]], expected: 0 },
      { args: [[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]], expected: 10 },
      { args: [[[0], [1], [0]]], expected: 0 },
    ],
    solution: {
      py: `def uniquePaths(grid):
    m = len(grid[0])
    dp = [0] * m
    dp[0] = 1
    for row in grid:
        for j in range(m):
            if row[j] == 1:
                dp[j] = 0
            elif j:
                dp[j] += dp[j - 1]
    return dp[-1]`,
      js: `function uniquePaths(grid) {
    const m = grid[0].length
    const dp = new Array(m).fill(0)
    dp[0] = 1
    for (const row of grid) {
        for (let j = 0; j < m; j++) {
            if (row[j] === 1) dp[j] = 0
            else if (j) dp[j] += dp[j - 1]
        }
    }
    return dp[m - 1]
}`,
    },
    explanation: `В клетку можно прийти сверху или слева: \`dp[i][j] = dp[i−1][j] + dp[i][j−1]\`, в препятствии — 0. Одномерный массив: \`dp[j]\` до обновления хранит значение сверху, \`dp[j−1]\` — уже обновлённое значение слева.

**Сложность:** O(n · m) времени, O(m) памяти.`,
    hints: ['Откуда можно прийти в клетку?'],
  },
  {
    id: 'max-subarray',
    title: 'Максимальная сумма подмассива',
    difficulty: 'easy',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Найдите непустой непрерывный подмассив с максимальной суммой и верните эту сумму. Нужно O(n).`,
    fn: 'maxSubArray',
    params: ['nums'],
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-3, -1, -2]], expected: -1 },
    ],
    solution: {
      py: `def maxSubArray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
      js: `function maxSubArray(nums) {
    let cur = nums[0], best = nums[0]
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i])
        best = Math.max(best, cur)
    }
    return best
}`,
    },
    explanation: `Алгоритм Кадане: \`cur\` — лучшая сумма подмассива, заканчивающегося в текущей позиции. Либо продолжаем предыдущий подмассив, либо начинаем новый с текущего элемента. Инициализируйте первым элементом, а не нулём — иначе для массива из отрицательных чисел получите 0.

**Сложность:** O(n) времени, O(1) памяти.`,
    hints: ['Какой лучший подмассив заканчивается в позиции i?'],
  },
  {
    id: 'knapsack',
    title: 'Рюкзак 0/1',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Есть предметы с весами \`w\` и ценностями \`v\` и рюкзак вместимостью \`cap\`. Каждый предмет можно взять не больше одного раза. Найдите максимальную суммарную ценность.`,
    fn: 'knapsack',
    params: ['w', 'v', 'cap'],
    tests: [
      { args: [[1, 3, 4, 5], [1, 4, 5, 7], 7], expected: 9 },
      { args: [[5], [10], 4], expected: 0 },
      { args: [[1, 1, 1], [10, 20, 30], 2], expected: 50 },
      { args: [[], [], 10], expected: 0 },
      { args: [[2, 3, 4], [3, 4, 5], 5], expected: 7 },
    ],
    solution: {
      py: `def knapsack(w, v, cap):
    dp = [0] * (cap + 1)
    for wi, vi in zip(w, v):
        for c in range(cap, wi - 1, -1):
            dp[c] = max(dp[c], dp[c - wi] + vi)
    return dp[cap]`,
      js: `function knapsack(w, v, cap) {
    const dp = new Array(cap + 1).fill(0)
    for (let i = 0; i < w.length; i++) {
        for (let c = cap; c >= w[i]; c--) dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i])
    }
    return dp[cap]
}`,
    },
    explanation: `\`dp[c]\` — лучшая ценность при вместимости \`c\` среди уже рассмотренных предметов. Для нового предмета либо не берём его, либо берём и смотрим на \`dp[c − w]\`. Цикл по вместимости идёт **сверху вниз**, чтобы \`dp[c − w]\` ещё относилось к предыдущему набору предметов и предмет не взялся дважды.

**Сложность:** O(n · cap).`,
    hints: ['Состояние — вместимость.', 'В каком порядке обновлять массив, чтобы не взять предмет дважды?'],
  },
  {
    id: 'lcs',
    title: 'Наибольшая общая подпоследовательность',
    difficulty: 'medium',
    pattern: 'Динамическое программирование',
    topic: 'algo-dp',
    statement: `Найдите длину наибольшей общей подпоследовательности двух строк (символы не обязаны идти подряд, но порядок сохраняется).`,
    fn: 'lcs',
    params: ['a', 'b'],
    tests: [
      { args: ['abcde', 'ace'], expected: 3 },
      { args: ['abc', 'abc'], expected: 3 },
      { args: ['abc', 'def'], expected: 0 },
      { args: ['', 'a'], expected: 0 },
      { args: ['bsbininm', 'jmjkbkjkv'], expected: 1 },
    ],
    solution: {
      py: `def lcs(a, b):
    m = len(b)
    prev = [0] * (m + 1)
    for ch in a:
        cur = [0] * (m + 1)
        for j in range(1, m + 1):
            cur[j] = prev[j - 1] + 1 if ch == b[j - 1] else max(prev[j], cur[j - 1])
        prev = cur
    return prev[m]`,
      js: `function lcs(a, b) {
    const m = b.length
    let prev = new Array(m + 1).fill(0)
    for (const ch of a) {
        const cur = new Array(m + 1).fill(0)
        for (let j = 1; j <= m; j++) cur[j] = ch === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1])
        prev = cur
    }
    return prev[m]
}`,
    },
    explanation: `\`dp[i][j]\` — ответ для префиксов \`a[:i]\` и \`b[:j]\`. Если последние символы совпали — берём их в подпоследовательность: \`dp[i−1][j−1] + 1\`. Иначе один из них не участвует: \`max(dp[i−1][j], dp[i][j−1])\`. Храним две строки таблицы.

**Сложность:** O(n · m).`,
    hints: ['Сравните последние символы префиксов.'],
  },
]
