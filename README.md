# window.functions.js
window.functions.js는 최소한의 기능만을 지원하는 대신 가장 좋은 성능을 가진 함수형 자바스크립트 라이브러리입니다. Partial.js와 거의 동일한 컨셉을 가지고 있지만, 보조 함수의 인자가 하나만 들어오거나, 가장 간결하거나 등의 특징을 가지고 있어서 이만의 쓰임새가 있습니다. 더 많은 기능이 필요하면 [Partial.js](https://marpple.github.io/partial.js/)와 함께 사용하면 좋습니다.

## Pipe

### _pipe

`_pipe`는 함수들을 모아서 하나의 함수로 합성하는 함수입니다. 왼쪽에서 오른쪽으로 실행됩니다.

```javascript
function sum(a, b) {
  return a + b;
}

function square(a) {
  return a * a;
}

var f1 = _pipe(sum, square, square);
var result = f1(1, 2)
console.log(result);
// 81
```

### _go

`_go`는 파이프라인의 즉시 실행 버전입니다. 첫 번째 인자로 받은 값을 두 번째 인자로 받은 함수에게 넘겨주고 두 번째 인자로 받은 함수의 결과는 세 번째 함수에게 넘겨주는 것을 반복하다가 마지막 함수의 결과를 리턴해줍니다.

```javascript
_go(10, // 첫 번째 함수에서 사용할 인자
  function(a) { return a * 10 }, // 연속 실행할 함수 1
  // 100
  function(a) { return a - 50 }, // 연속 실행할 함수 2
  // 50
  function(a) { return a + 10 }); // 연속 실행할 함수 3
  // 60
```

### _mr

window.functions.js의 파이프라인 함수들은 Multiple Results를 지원합니다. `_mr` 함수를 함께 사용하면 다음 함수에게 2개 이상의 인자들을 전달할 수 있습니다.

```javascript
_go(10, // 첫 번째 함수에서 사용할 인자
  function(a) { return _mr(a * 10, 50) }, // 두 개의 값을 리턴
  function(a, b) { return a - b }, // 두 개의 인자 받기
  function(a) { return a + 10 });
  // 60

_go(_mr(2, 3),
  function(a, b) {
    return a + b; // 2 + 3
  },
  function(a) {
    return a * a;
  });
  // 25
```

### _tap

`_tap`은 받아둔 함수들을 모두 실행한 후 처음 받은 인자를 동일하게 리턴하는 파이프라인 함수입니다.

```javascript
_go(10,
  _tap(
    function(a) { return a * a },
    console.log), // 100
  console.log); // 10
```

## List, Object

### _each
`_each(list, iteratee)` 리스트를 끝까지 순회하며 함수를 실행합니다.
```javascript
_each([1, 2, 3], alert);
// alert 함수가 각 번호에 맞춰 실행됩니다.
_each({one: 1, two: 2, three: 3}, alert)
// alert 함수가 각 번호 값에 맞춰 실행됩니다.
```

### _map, _omap
`_map(list, iteratee)` 리스트를 순회하며 주어진 함수로 새로운 배열을 생성합니다.
```javascript
_map([1,2,3], function(num) { return num * 3; });
// [3, 6, 9]
_omap({one: 1, two: 2, three: 3}, function(num, key) { return num * 3; });
// [3, 6, 9]
```

### _filter, _ofilter
`_filter(list, predicate)` 리스트의 내부 값을 관찰하여 predicate의 결과가 참인 값들을 배열로 반환합니다.
```javascript
var evens = _filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
console.log(evens); // [2, 4, 6]
```

### _reject, _oreject
`_reject(list, predicate)` 리스트를 순회하며 predicate의 결과가 참인 값들을 제외한 배열을 반환합니다.
```javascript
var odds = _reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
console.log(odds); // [1, 3, 5]
```

### _reduce, _oreduce
`_reduce(list, iteratee, [memo])` `inject` 혹은 `foldl`라고 불리는 이 함수는 리스트를 순회하며 하나의 값을 추출합니다. `memo`는 옵션값이며 추출될 값의 초기값이 됩니다.
```javascript
_reduce([1, 2, 3], function(memo, num) { return memo + num; }, 0);
// 6

_oreduce({one: 1, two: 2, three: 3}, function(memo, num) { return memo + num; }, 0);
// 6
```

### _find, _ofind
`_find(list, predicate)` 리스트의 내부 값을 관찰하여 predicate의 결과가 참인 값을 반환합니다.
```javascript
var even = _find([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
console.log(even); // 2
```

## Etc

### _keys
`_keys(object)` 객체가 가진 프로퍼티의 이름인 키 값들을 모아 배열을 만듭니다.
```javascript
_keys({one: 1, two: 2, three: 3});
// ["one", "two", "three"]
```

### _range
`_range([start], stop, [step])` 범위를 정해 정수로 구성된 배열을 만듭니다. 값을 하나만 전달하면 0부터 전달된 값 이전까지가 범위가 됩니다.
```javascript
_range(10);
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
_range(1, 11);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
_range(0, 30, 5);
// [0, 5, 10, 15, 20, 25]
_range(0, -10, -1);
// [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
_range(0);
// []
```

### _identity
```javascript
function _identity(v) { return v };
```

### _noop
```javascript
function _noop() {};
```
