---
title: "[Vue.js] Vue.js 시작하기 ⑥ Axios 사용하기"
excerpt: ""
categories: vue
tags: frontend vue.js axios
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## Axios
Vue에서 권고하고 있는 HTTP 통신 라이브러리

### 1. CDN
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

### 2. Example
```html
<div id="app">
    <button v-on:click="getData">get user</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
new Vue({
    el: '#app',
    methods: {
        getData: function() { 
            // ...
        }
    }
})
</script>
```

```js
getData: function() { 
    axios.get('https://jsonplaceholder.typicode.com/users/') // [1]
    .then(function(response) {      // [2]
        console.log(response);
    })
    .catch(function(error) {        // [3]
        console.log(error);
    });
}
```
- [1] : <https://jsonplaceholder.typicode.com/users/> 으로 테스트용 사용자의 정보가 담기 배열을 요청한다.
- [2] : 정상적으로 요청에 대한 결과를 받아오면 `then()`으로 진입한다.
- [3] : 실패하면 `catch()`로 진입한다.

<br>
개발자 도구의 콘솔창에서 axios의 구조도 확인할 수 있다.

![axios-structure](/assets/images/post/20210512/axios-structure.png)

<br>

```js
new Vue({
    // ...
    data: {
        users: []   // [1]
    },
    methods: {
        getData: function() { 
            var vm = this;  // [2]
            axios.get('https://jsonplaceholder.typicode.com/users/')
                .then(function(response) {  
                vm.users = response.data;   // [3]
                // this.users = response.data; (x) [4]
                })
                // ...
        }
    }
})
```
- [1] : 테스트용 사용자 정보를 담을 배열
- [2] : axios를 호출하기 전, Vue에 대한 정보를 담는다. 
- [3] : 처리 결과를 Vue data 내부의 `userㄴ`에 담는다.
- [4] : axios 내부에서는 this를 이용하여 Vue의 data에 접근할 수 없다.

## 기타
### 웹 서비스에서의 클라이언트와 서버
1. HTTP 요청(Request) [클라이언트 → 서버]
2. 서버에서 요청을 받아서 내부 로직에 의해 DB에서 값을 꺼내온다. [서버 ↔ DB]
3. 결과를 HTTP 응답(Response) [서버 → 클라이언트]

### 크롬 개발자 도구 - 네트워크 패널
크롬 개발자도구에서 네트워크 탭 - XHR 탭
- Header 탭에서는 Request Header와 Response Header에 대한 정보를 확인할 수 있다.
  
    ![dev-tool-network-1](/assets/images/post/20210512/dev-tool-network-1.png)

- Preview 또는 Response 탭 에서는 요청 결과를 확인할 수 있다.
  
    ![dev-tool-network-2](/assets/images/post/20210512/dev-tool-network-2.png)

    ![dev-tool-network-3](/assets/images/post/20210512/dev-tool-network-3.png)

## 더 읽을거리
- Ajax
- Promise
- JS의 비동기 처리 패턴
  1. callback
  2. promise
  3. promise + generator
  4. async & await

## References
- <https://www.inflearn.com/course/Age-of-Vuejs/>