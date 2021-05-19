---
title: "[JS] Promise와 async/await"
excerpt: ""
categories: js
---
## Introduction
[드림코딩 by 엘리](https://www.youtube.com/playlist?list=PLv2d7VI9OotTVOL4QmPfvJWPJvkmv6h-2) YouTube 영상 중 비동기처리 관련 영상을 시청하고 공부한 내용에 대해서 정리하려고 한다.

동기와 비동기 처리에 대한 개념을 정리하고, 비동기처리시 Promise 객체를 사용해야하는 이유와 사용방법에 대해서 정리한다.

## 기본 용어
### 동기와 비동기
**동기**(synchronous)적으로 실행된다는 것은 요청과 동시에 결과가 반환된다는 것이다. 

**비동기**(Asynchronous)적으로 실행된다는 것은 요청과 동시에 결과가 동시에 반환되지 않는 것이다. 

자바스크립트에서는 비동기적 처리가 필요한 코드는 응답을 기다리지 않고, 다음 코드를 실행한다. 따라서 비동기적 처리는 언제 실행되어 결과가 반환될지 예측할 수 없다.

### 콜백함수와 콜백지옥
**콜백함수**란 매개변수로 전달되는 함수로, 함수가 실행될 때 다시 호출된다. 콜백함수는 즉각적으로 실행하는 동기적 콜백과 비동기적 콜백으로 나누어진다.

동기적 콜백
```js
function printImmediately(print) {
    print();
}
printImmediately(() => console.log('hello'));
```

비동기적 콜백
```js
function printWithDelay(print, timeout) {
    setTimeout(print, timeout);
}
printWithDelay(() => console.log('async callback'), 2000);  // [1]
```
- [1] : 2초뒤 'async callback'이 출력된다.

<br>

**콜백지옥**은 콜백함수 내부에 다시 콜백함수를 반복적으로 호출함으로써 들여쓰기 수준이 감당하기 힘들정도로 깊어지는 것을 말한다.

콜백지옥은 가독성을 떨어뜨리고, 어디서 문제가 발생했는지 파악하기 어렵기 때문에 유지보수가 어렵다.

## Promise
콜백지옥을 해결하기 위한 비동기처리 오브젝트로, 정상적으로 처리되면 결과를 전달하고, 문제가 발생하면 에러를 전달한다.

### Promise 생성하기
promise를 생성하면 전달하는 콜백함수는 바로 실행된다.
```js
new Promise(function(resolve, reject) {
    // heavy work  ex: network, read files...
});
```

정상적으로 처리되면 `resolve`를 호출한다. `resolve`에 전달하는 매개변수는 `then()`에 전달되는 콜백함수의 매개변수로 전달된다.
```js
new Promise(function(resolve, reject) {
    // ...
    resolve('success'); 
}
```

문제가 발생한다면 `reject`를 호출한다. `reject`에 전달하는 매개변수는 `reject()`에 전달되는 콜백함수의 매개변수로 전달된다. 
```js
new Promise(function(resolve, reject) {
    // ...
    reject(new Error('no network'));
}
```

### `.then()`
`.then()`에 전달되는 콜백함수의 매개변수는 `resolve()`에서 전달된 변수다. 
```js
const promise = new Promise(function(resolve, reject) {
    setTimeout(() => {
        resolve('success'); 
    }, 2000);
});

promise
    .then(function(value) {
        console.log(value); // [1]
    });
```
- [1] : 2초 뒤에 'success`가 출력된다.
<br>

`.then()`에 전달되는 콜백함수에서 `return`하는 값은 다음 promise 객체에 전달된다. 
```js
const promise = new Promise(function(resolve, reject) {
    setTimeout(() => {
        resolve(1); 
    }, 2000);
});

promise
    .then(function(value) {
        console.log(value);     // [1]
        return 3 * value;
    })
    .then(function(nextValue) { 
        console.log(nextValue); // [2]
    });
```
- [1] : 2초 뒤에 3이 출력된다.
- [2] : 이전의 `then()`에서 `return`한 값인 3 이 전달된다.


### `.catch()` & `finally()`
`.catch()`에 전달되는 콜백함수의 매개변수는 `reject()`에서 전달된 변수다. `.then()`에서 문제가 발생했을 때 실행된다.

`.finally()`는 결과와는 상관없이 무조건 실행되는 영역이다.

```js
promise
    .then(function(value) { 
        // promise에서 `resolve`를 호출했을 때 실행되는 영역
    })
    .catch(function(error) {
        // promise에서 `reject`를 호출했을 때 실행되는 영역
    })
    .finally(function() {
        // 결과와는 상관없이 무조건 실행되는 영역
    });
```

### Promise의 State
- `pending` : `resolve()` 또는 `reject()`를 호출하기 전의 상태
- `fulfilled` : `resolve()`를 호출한 상태
- `rejected` : `reject()`를 호출한 상태

<br>
Promise는 `.then()`을 계속 매달아 사용하여 비동기적 처리의 순차적인 흐름을 직관적으로 쉽게 파악할 수 있다.

## `async` & `await`
### `async`
`return`되는 값을 자동적으로 Promise로 변환해준다.
```js
async function fetchUser() {
    return 'user';
}
```

아래의 내용과 같다.
```js
function fetchUser() {
    return new Promise(function(resolve, reject) {
        resolve('user');
    });
}
```

### `await`
`async` 내부에서만 사용 가능하다.

### Example
```js
function delay(ms) {    // [1]
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

async function getApple() { // [2]
    await delay(1000); 
    return '사과';
}
```
- [1] : ms 시간이 지나면 resolve를 호출한다.
- [2] : 1초 후에 '사과'를 반환한다.

### 사용시 주의사항
병렬적으로 `await`를 사용하면 하나를 처리하고 다시 기다려야 한다.
```js
async function getBanana() {    // [1]
    await delay(2000);
    return '바나나';
}

async function pickFruis() {
    const apple = await getApple();     // [2]
    const banana = await getBanana();   // [3]
    return `${apple} + ${banana};`      // [4]
}
```
- [1] : 2초 후에 '바나나'를 반환한다.
- [2] : 1초 후에 '사과'를 반환한다.
- [3] : [1]이 실행되고, 다시 2초를 기다린 후에 '바나나'를 반환한다.
- [4] : 따라서, 3초 후에 결과값을 반환할 수 있다.
<br>

위와 같이 `await`를 병렬적으로 사용했을 경우 비효율적이다. 이 문제를 해결하기 위해서 우선 Promise를 생성하고 `await`를 걸면 된다. Promise를 생성하면 내부의 로직이 바로 실행되기 때문에 동시에 처리가 진행된다.
```js
async function pickFruis() {
    const applePromise = getApple();    // [1]
    const bananaPromise = getBanana();  // [2]
    const apple = await applePromise;   // [3]
    const banana = await bananaPromise; // [4]
    return `${apple} + ${banana}`;      // [5]
}
```
- [1], [2] : 내부 로직이 바로 실행된다.
- [3] : 1초 후에 '사과'를 반환한다.
- [4] : 2초가 걸리지만, 이미 1초가 지났기 때문에 1초만 더 기다린 후에 '바나나'를 반환한다.
- [5] : 따라서, 2초 후에 결과값을 반환할 수 있다.

## 유용한 Promise API
### all()
Promise 배열을 전달하면, 모든 Promise 처리가 끝날때까지 기다리고 결과를 배열 형식으로 반환한다.
```js
function pickAllFruits() {
    return Promise.all([getApple(), getBanana()]) 
        .then(fruits => fruits.join(' + ')); 
}

pickAllFruits().then(console.log);  // [1]
```
- [1] : 2초 후에 '사과 + 바나나'를 반환한다.

### race()
Promise 배열을 전달하면, 가장 먼저 처리가 끝나는 Promise 결과만 전달한다.
```js
function pickOnlyOne() {
    return Promise.race([getApple(), getBanana()]);
}

pickOnlyOne().then(console.log);    // [1]
```
- [1] : 1초 후에 '사과'를 반환한다.

## References
- <https://www.youtube.com/watch?v=s1vpVCrT8f4&list=PLv2d7VI9OotTVOL4QmPfvJWPJvkmv6h-2&index=11>
- <https://www.youtube.com/watch?v=JB_yU6Oe2eE&list=PLv2d7VI9OotTVOL4QmPfvJWPJvkmv6h-2&index=12>
- <https://www.youtube.com/watch?v=aoQSOZfz3vQ&list=PLv2d7VI9OotTVOL4QmPfvJWPJvkmv6h-2&index=13>
- <https://velog.io/@yujo/JS%EC%BD%9C%EB%B0%B1-%EC%A7%80%EC%98%A5%EA%B3%BC-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%A0%9C%EC%96%B4#%EC%BD%9C%EB%B0%B1-%EC%A7%80%EC%98%A5-%ED%83%88%EC%B6%9C-2-promise>