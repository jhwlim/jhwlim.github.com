## Array
### 배열 생성
#### `[]`를 이용
```js
var arr = ['a', 'b', 'c'];
```

#### 생성자를 이용
```js
var arr = new Array();

arr[0] = 'a';
arr[1] = 'b';
arr[2] = 'c';
```

```js
var arr = new Array('a', 'b', 'c');
```

```js
var arr = new Array(3); // arr.length = 3
```

### for문을 이용하여 배열의 요소에 순차적으로 접근하기
#### for
```js
for (var i = 0; i < arr.length; i++) {  
    console.log(arr[i]);
}
```

#### for ... in
```js
for (var i in arr) {
    console.log(i);         // i : 배열의 인덱스
    console.log(arr[i])     // arr[i] : 배열의 요소
}
```

#### for ... of
```js
for (var i of arr) {
    console.log(i);         // i : 배열의 요소
}
```

### Summary
|Propeties|Description|
|:--|:--|
|length|배열의 길이|

|Methods|Description|
|:--|:--|
|indexOf(element)|
|include(element)<br>include(element, fromIndex)|
|splice(fromIndex, deleteNumber)| 배열의 요소 제거
|push()|
|pop()|
|sort()<br>sort(compareFunction)|
|reverse()|
|shift()| 배열의 첫번째 요소 제거
|unshift(element)| 배열의 맨 앞에 요소를 추가

### 배열의 정렬
유니코드 값을 기준으로 정렬된 배열을 반환한다. 이때, 원본 배열은 변하지 않는다.
```js
var arr = ['b', 'a', 'c'];
console.log(arr.sort()); // [a, b, c]

var nums = [11, 5, 2];
console.log(nums.sort());   // [11, 2, 5]
```

`compare` 함수를 매개변수로 제공하여 정렬 기준을 정할 수 있다.
```js
var compare = function(a, b) {
    return a - b;
}
console.log(nums.sort(compare));    // [2, 5, 11]
```
