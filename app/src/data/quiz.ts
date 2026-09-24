import type { QuizItem } from '../types'

export const quiz: QuizItem[] = [
  {
    id: 'el-1',
    topic: 'Event loop',
    level: 1,
    code: `console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')`,
    answer: '1\n4\n3\n2',
    explanation: 'Сначала выполняется весь синхронный код: 1 и 4. Затем очищается очередь микрозадач — колбэк промиса (3). Только после этого event loop берёт следующую макрозадачу — setTimeout (2), даже с задержкой 0.',
  },
  {
    id: 'el-2',
    topic: 'Event loop',
    level: 2,
    code: `setTimeout(() => console.log('timeout'), 0)
Promise.resolve()
  .then(() => {
    console.log('then 1')
    setTimeout(() => console.log('timeout 2'), 0)
  })
  .then(() => console.log('then 2'))
queueMicrotask(() => console.log('micro'))
console.log('sync')`,
    answer: 'sync\nthen 1\nmicro\nthen 2\ntimeout\ntimeout 2',
    explanation: 'Синхронно — «sync». В очереди микрозадач сначала then 1, затем micro (поставлен раньше, чем then 2, который появляется только после выполнения then 1). then 2 выполняется в той же фазе микрозадач. Затем макрозадачи по порядку постановки: timeout, потом timeout 2.',
  },
  {
    id: 'el-3',
    topic: 'Event loop',
    level: 2,
    code: `async function a() {
  console.log('a1')
  await b()
  console.log('a2')
}
async function b() {
  console.log('b')
}
console.log('start')
a()
console.log('end')`,
    answer: 'start\na1\nb\nend\na2',
    explanation: 'async-функция выполняется синхронно до первого await. b() тоже синхронно печатает «b» и возвращает промис. Продолжение после await (a2) планируется как микрозадача и выполняется после синхронного «end».',
  },
  {
    id: 'el-4',
    topic: 'Event loop',
    level: 3,
    code: `console.log(1)
new Promise((resolve) => {
  console.log(2)
  resolve()
  console.log(3)
}).then(() => console.log(4))
setTimeout(() => console.log(5))
Promise.reject().catch(() => console.log(6))
console.log(7)`,
    answer: '1\n2\n3\n7\n4\n6\n5',
    explanation: 'Функция-исполнитель промиса выполняется синхронно, и resolve не прерывает её: 2 и 3 печатаются сразу. Синхронно также 1 и 7. Микрозадачи в порядке постановки: then (4), затем catch (6). Последним — setTimeout (5).',
  },
  {
    id: 'el-5',
    topic: 'Event loop',
    level: 2,
    code: `const p = new Promise((res) => setTimeout(() => res('done'), 0))
p.then((v) => console.log(v))
setTimeout(() => console.log('timer'), 0)
console.log('sync')`,
    answer: 'sync\ndone\ntimer',
    explanation: 'Первый setTimeout (с resolve) поставлен раньше второго. Когда он срабатывает, промис разрешается, и then ставится в микрозадачи — они выполняются до следующей макрозадачи. Поэтому done раньше timer.',
  },
  {
    id: 'this-1',
    topic: 'this',
    level: 1,
    code: `const user = {
  name: 'Аня',
  greet() {
    return 'Привет, ' + this.name
  },
}
const greet = user.greet
console.log(user.greet())
console.log(greet.call({ name: 'Боря' }))`,
    answer: 'Привет, Аня\nПривет, Боря',
    explanation: 'this определяется способом вызова, а не местом объявления. user.greet() — this = user. call явно передаёт this. Если бы вызвали просто greet(), в строгом режиме this был бы undefined и была бы ошибка.',
  },
  {
    id: 'this-2',
    topic: 'this',
    level: 2,
    code: `const obj = {
  value: 42,
  regular() {
    return [1].map(function () { return this?.value })[0]
  },
  arrow() {
    return [1].map(() => this.value)[0]
  },
}
console.log(obj.regular())
console.log(obj.arrow())`,
    answer: 'undefined\n42',
    explanation: 'Обычная функция-колбэк вызывается map без this — в модуле (строгий режим) это undefined, поэтому this?.value даёт undefined. Стрелочная функция не имеет своего this и берёт его из окружающего метода arrow, где this = obj.',
  },
  {
    id: 'this-3',
    topic: 'this',
    level: 2,
    code: `class Counter {
  count = 0
  inc() { this.count++; return this.count }
}
const c = new Counter()
const inc = c.inc
try {
  inc()
} catch (e) {
  console.log(e.constructor.name)
}
const bound = c.inc.bind(c)
console.log(bound())`,
    answer: 'TypeError\n1',
    explanation: 'Тело класса всегда в строгом режиме. Метод, оторванный от объекта, вызывается с this = undefined, и обращение this.count бросает TypeError. bind навсегда привязывает this к c. Эту ошибку часто ловят в React-обработчиках.',
  },
  {
    id: 'this-4',
    topic: 'this',
    level: 3,
    code: `function Person(name) {
  this.name = name
  this.sayLater = function () {
    return () => this.name
  }
}
const p = new Person('Ира')
const f = p.sayLater()
console.log(f())
console.log(f.call({ name: 'Олег' }))`,
    answer: 'Ира\nИра',
    explanation: 'Стрелочная функция запоминает this в момент создания — внутри sayLater, вызванного как метод p. Изменить this стрелочной функции через call, apply или bind нельзя.',
  },
  {
    id: 'cl-1',
    topic: 'Замыкания',
    level: 1,
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}`,
    answer: '3\n3\n3',
    explanation: 'var имеет функциональную область видимости: переменная i одна на весь цикл. Колбэки выполняются после завершения цикла, когда i уже 3. С let каждая итерация получает свою копию, и вывод будет 0, 1, 2.',
  },
  {
    id: 'cl-2',
    topic: 'Замыкания',
    level: 1,
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}`,
    answer: '0\n1\n2',
    explanation: 'let создаёт новую привязку переменной на каждую итерацию цикла, и каждое замыкание захватывает свою.',
  },
  {
    id: 'cl-3',
    topic: 'Замыкания',
    level: 2,
    code: `function makeCounter() {
  let n = 0
  return { inc: () => ++n, get: () => n }
}
const a = makeCounter()
const b = makeCounter()
a.inc(); a.inc(); b.inc()
console.log(a.get(), b.get())`,
    answer: '2 1',
    explanation: 'Каждый вызов makeCounter создаёт новое лексическое окружение со своей n. Функции inc и get одного счётчика замкнуты на одну и ту же переменную, а счётчики между собой независимы.',
  },
  {
    id: 'cl-4',
    topic: 'Замыкания',
    level: 2,
    code: `let x = 1
function show() { console.log(x) }
function run() {
  let x = 2
  show()
}
run()`,
    answer: '1',
    explanation: 'В JS лексическая (статическая) область видимости: show видит переменные там, где она объявлена, а не там, где вызвана. Поэтому x = 1.',
  },
  {
    id: 'hoist-1',
    topic: 'Hoisting',
    level: 1,
    code: `console.log(typeof hoisted)
console.log(typeof notHoisted)
function hoisted() {}
var notHoisted = function () {}`,
    answer: 'function\nundefined',
    explanation: 'Объявление функции (function declaration) всплывает целиком. У var всплывает только объявление переменной со значением undefined, присваивание функции произойдёт позже.',
  },
  {
    id: 'hoist-2',
    topic: 'Hoisting',
    level: 2,
    code: `try {
  console.log(value)
} catch (e) {
  console.log(e.name)
}
let value = 5`,
    answer: 'ReferenceError',
    explanation: 'let и const тоже «всплывают», но до строки объявления находятся во временной мёртвой зоне (TDZ). Обращение к ним бросает ReferenceError, а не возвращает undefined, как у var.',
  },
  {
    id: 'type-1',
    topic: 'Приведение типов',
    level: 1,
    code: `console.log(1 + '2')
console.log('3' - 1)
console.log(true + 1)
console.log([] + [])`,
    answer: '12\n2\n2\n',
    explanation: 'Плюс со строкой — конкатенация: "12". Минус приводит к числу: 2. true → 1, поэтому 2. Пустые массивы приводятся к пустым строкам, их сумма — пустая строка (последняя строка вывода пустая).',
  },
  {
    id: 'type-2',
    topic: 'Приведение типов',
    level: 2,
    code: `console.log(0 == '')
console.log(0 === '')
console.log(null == undefined)
console.log(null == 0)
console.log(NaN === NaN)`,
    answer: 'true\nfalse\ntrue\nfalse\nfalse',
    explanation: 'Нестрогое сравнение приводит "" к 0. Строгое сравнивает и типы. null нестрого равен только undefined (и самому себе), но не 0. NaN не равен ничему, даже себе — проверять через Number.isNaN.',
  },
  {
    id: 'type-3',
    topic: 'Приведение типов',
    level: 2,
    code: `console.log(typeof null)
console.log(typeof [])
console.log(Array.isArray([]))
console.log(typeof NaN)`,
    answer: 'object\nobject\ntrue\nnumber',
    explanation: 'typeof null === "object" — историческая ошибка языка. Массив — объект, поэтому его проверяют через Array.isArray. NaN — это значение типа number.',
  },
  {
    id: 'type-4',
    topic: 'Приведение типов',
    level: 3,
    code: `const a = {}
const b = { key: 'b' }
const c = { key: 'c' }
a[b] = 123
a[c] = 456
console.log(a[b])`,
    answer: '456',
    explanation: 'Ключи обычного объекта — строки (или символы). Объекты b и c приводятся к одной и той же строке "[object Object]", поэтому второе присваивание перезаписывает первое. Для ключей-объектов нужен Map. Задача встречалась на интервью в МТС.',
  },
  {
    id: 'type-5',
    topic: 'Приведение типов',
    level: 2,
    code: `console.log(0.1 + 0.2 === 0.3)
console.log((0.1 + 0.2).toFixed(2))
console.log([10, 9, 1].sort())`,
    answer: 'false\n0.30\n[ 1, 10, 9 ]',
    explanation: '0.1 и 0.2 не представимы точно в двоичной плавающей точке, сумма чуть больше 0.3. toFixed возвращает строку. sort() без компаратора сравнивает элементы как строки: "1" < "10" < "9". Числа сортируют с (a, b) => a - b.',
  },
  {
    id: 'obj-1',
    topic: 'Объекты и ссылки',
    level: 1,
    code: `const a = { n: 1 }
const b = a
b.n = 2
console.log(a.n)
const c = { ...a }
c.n = 3
console.log(a.n)`,
    answer: '2\n2',
    explanation: 'Объекты передаются по ссылке: b указывает на тот же объект, что и a. Spread создаёт новый объект — поверхностную копию, изменение c не трогает a.',
  },
  {
    id: 'obj-2',
    topic: 'Объекты и ссылки',
    level: 2,
    code: `const user = { name: 'Аня', tags: ['a'] }
const copy = { ...user }
copy.name = 'Боря'
copy.tags.push('b')
console.log(user.name, user.tags.length)`,
    answer: 'Аня 2',
    explanation: 'Spread копирует только верхний уровень. Строка name у копии своя, а массив tags — общий по ссылке. Глубокая копия — structuredClone(user).',
  },
  {
    id: 'obj-3',
    topic: 'Объекты и ссылки',
    level: 2,
    code: `function change(obj, num) {
  obj.x = 10
  obj = { x: 20 }
  num = 5
}
const o = { x: 1 }
let n = 1
change(o, n)
console.log(o.x, n)`,
    answer: '10 1',
    explanation: 'Аргументы передаются по значению, но значение объекта — ссылка. Изменение свойства через ссылку видно снаружи, а переприсваивание параметра obj создаёт новую локальную ссылку и на o не влияет. Примитив n копируется.',
  },
  {
    id: 'obj-4',
    topic: 'Объекты и ссылки',
    level: 2,
    code: `const frozen = Object.freeze({ a: 1, inner: { b: 1 } })
try {
  frozen.a = 2
} catch (e) {
  console.log('error')
}
frozen.inner.b = 2
console.log(frozen.a, frozen.inner.b)`,
    answer: 'error\n1 2',
    explanation: 'В строгом режиме (модули) запись в замороженный объект бросает TypeError. freeze поверхностный: вложенный объект остаётся изменяемым.',
  },
  {
    id: 'proto-1',
    topic: 'Прототипы',
    level: 2,
    code: `function Animal(name) { this.name = name }
Animal.prototype.speak = function () { return this.name + ' издаёт звук' }
const cat = new Animal('Кот')
console.log(cat.speak())
console.log(cat.hasOwnProperty('speak'))
console.log(Object.getPrototypeOf(cat) === Animal.prototype)`,
    answer: 'Кот издаёт звук\nfalse\ntrue',
    explanation: 'Метод лежит в прототипе, а не в самом объекте — hasOwnProperty возвращает false. Объект, созданный через new, получает [[Prototype]] = Animal.prototype. При вызове метода поиск идёт по цепочке прототипов.',
  },
  {
    id: 'proto-2',
    topic: 'Прототипы',
    level: 3,
    code: `class A { hi() { return 'A' } }
class B extends A { hi() { return 'B' + super.hi() } }
const b = new B()
console.log(b.hi())
console.log(b instanceof A)
A.prototype.hi = () => 'X'
console.log(b.hi())`,
    answer: 'BA\ntrue\nBX',
    explanation: 'super.hi() ищет метод в прототипе родителя в момент вызова. После замены A.prototype.hi вызов подхватывает новую функцию. instanceof проверяет, есть ли A.prototype в цепочке прототипов b.',
  },
  {
    id: 'prom-1',
    topic: 'Промисы',
    level: 2,
    code: `Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { throw new Error('boom ' + x) })
  .then(() => console.log('skip'))
  .catch((e) => { console.log(e.message); return 10 })
  .then((x) => console.log('after', x))`,
    answer: 'boom 2\nafter 10',
    explanation: 'Исключение в then превращает промис в отклонённый, следующие then пропускаются до ближайшего catch. catch возвращает значение — цепочка снова становится выполненной, и следующий then получает 10.',
  },
  {
    id: 'prom-2',
    topic: 'Промисы',
    level: 2,
    code: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms))
Promise.all([wait(30, 'a'), wait(10, 'b'), 'c']).then((r) => console.log(r.join('')))
Promise.race([wait(30, 'slow'), wait(10, 'fast')]).then(console.log)`,
    answer: 'fast\nabc',
    explanation: 'Promise.race разрешается первым завершившимся промисом — через 10 мс «fast». Promise.all ждёт всех (30 мс) и сохраняет порядок входного массива, а не порядок завершения. Не-промисы (c) принимаются как уже выполненные.',
  },
  {
    id: 'prom-3',
    topic: 'Промисы',
    level: 3,
    code: `async function f() {
  try {
    return Promise.reject(new Error('A'))
  } catch {
    console.log('caught inside')
  }
}
f().catch((e) => console.log('caught outside', e.message))`,
    answer: 'caught outside A',
    explanation: 'return без await возвращает отклонённый промис как есть — try/catch внутри функции его не перехватывает. Если написать return await Promise.reject(...), ошибка будет поймана внутри. Тонкость, которую любят спрашивать.',
  },
  {
    id: 'prom-4',
    topic: 'Промисы',
    level: 2,
    code: `const results = []
async function run() {
  for (const ms of [30, 10, 20]) {
    await new Promise((r) => setTimeout(r, ms))
    results.push(ms)
  }
  console.log(results.join(','))
}
run()`,
    answer: '30,10,20',
    explanation: 'await внутри for…of выполняет ожидания последовательно: следующий таймер запускается только после предыдущего. Для параллельного выполнения нужно сначала создать все промисы и дождаться их через Promise.all.',
  },
  {
    id: 'arr-1',
    topic: 'Массивы',
    level: 1,
    code: `const arr = [1, 2, 3]
arr[10] = 11
console.log(arr.length)
console.log(arr.filter(() => true).length)`,
    answer: '11\n4',
    explanation: 'length — это наибольший индекс плюс один, дыры не заполняются значениями. filter, map и forEach пропускают дыры, поэтому остаётся 4 элемента.',
  },
  {
    id: 'arr-2',
    topic: 'Массивы',
    level: 2,
    code: `console.log(['1', '2', '3'].map(parseInt))`,
    answer: '[ 1, NaN, NaN ]',
    explanation: 'map передаёт колбэку (элемент, индекс, массив). parseInt принимает второй аргумент — основание системы счисления: parseInt("1", 0) = 1, parseInt("2", 1) = NaN (нет системы с основанием 1), parseInt("3", 2) = NaN (цифры 3 в двоичной нет). Правильно — map(Number) или map((s) => parseInt(s, 10)).',
  },
  {
    id: 'arr-3',
    topic: 'Массивы',
    level: 2,
    code: `const a = [3, 1, 2]
const b = a.sort()
b.push(4)
console.log(a)
const c = a.toSorted((x, y) => y - x)
console.log(a === c, c[0])`,
    answer: '[ 1, 2, 3, 4 ]\nfalse 4',
    explanation: 'sort сортирует массив на месте и возвращает ссылку на тот же массив, поэтому push через b меняет a. toSorted (ES2023) возвращает новый массив и не трогает исходный.',
  },
  {
    id: 'misc-1',
    topic: 'Разное',
    level: 2,
    code: `const s = new Set([1, 2, 2, 3])
const m = new Map([[{}, 'a'], [{}, 'b']])
console.log(s.size, m.size)
console.log([...'привет'].reverse().join(''))`,
    answer: '3 2\nтевирп',
    explanation: 'Set хранит уникальные значения. Ключи Map сравниваются по ссылке: два разных пустых объекта — два разных ключа. Spread строки разбивает её по символам (точнее, по кодовым точкам Unicode).',
  },
  {
    id: 'misc-2',
    topic: 'Разное',
    level: 3,
    code: `let count = 0
const debounce = (fn, ms) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}
const inc = debounce(() => { count++; console.log('count', count) }, 20)
inc(); inc(); inc()
setTimeout(inc, 50)`,
    answer: 'count 1\ncount 2',
    explanation: 'Debounce откладывает вызов, пока вызовы идут чаще, чем раз в 20 мс. Три вызова подряд схлопываются в один (через 20 мс после последнего). Вызов через 50 мс — новая серия, ещё одно срабатывание. Реализовать debounce и throttle — частая задача на фронтенд-секциях.',
  },
]
