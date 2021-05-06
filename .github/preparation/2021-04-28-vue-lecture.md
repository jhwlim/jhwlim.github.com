
# Axios (액시오스)
뷰에서 권고하고 있는 HTTP 통신 라이브러리

Ajax
- 비동기적인 웹 어플리케이션 제작을 위해 웹 개발 기법

Promise : 자바스크립트의 비동기처리 패턴

자바스크립트의 비동기 처리 패턴
1. callback
2. promise
3. promise + generator
4. async & await

CDN
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

#### Example
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
            axios.get('https://jsonplaceholder.typicode.com/users/')
            .then(function(response) {  // 받아오고 나서 성공하면 then으로 진입
                console.log(response);
            })
            .catch(function(error) {  // 실패하면 catch로 진입
                console.log(error);
            });
        }
    }
})
</script>
```

<https://jsonplaceholder.typicode.com/users/>
- 약 10개의 사용자 정보가 담긴 배열
- jsonplaceholder : REST API 테스트 사이트

버튼을 클릭하면 위의 사이트에서 json형식으로 데이터를 받아온다.

콘솔창으로 확인할때, axios의 일반적인 구조도 확인할 수 있다.

## 18번 이미지

```js
new Vue({
    // ...
    data: {
        users: []
    },
    methods: {
        getData: function() { 
            // ...
            .then(function(response) {
                this.users = response.data;
            })
            // ...
        }
    }
})
```

이때, `this.users`으로 하면 뷰 개발자 도구에서 data의 변화 없다. axios를 호출하고서 내부의 this는 서로 다르기 때문이다. 따라서 아래와 같이 axios를 호출하기 전 this를 변수에 담아놓고서 해당 변수에 접근할 수 있다.

```js
methods: {
    var vm = this;
    getData: function() { 
        // ...
        .then(function(response) {
            // this.users = response.data;
            vm.users = response.data;
        })
        // ...
    }
}
```

### 웹 서비스에서의 클라이언트와 서버
(1) HTTP 요청(Request) (클라이언트 → 서버)
(2) 서버에서 요청을 받아서 내부 로직에 의해서 DB에 값을 꺼내온다
(3) 결과물이 HTTP 응답(Response) 으로 클라이언트에게 돌아간다.

### 크롬 개발자 도구 - 네트워크 패널 보는 방법
크롬 개발자 도구에서 네트워크 탭 - XHR 탭
Header 
- Request Header, Response Header
- 특정 요청에 대한 정보를 담는다.

Preview 또는 Response 탭에서 받은 데이터 확인 가능

#### 19번, 20번, 21번 이미지