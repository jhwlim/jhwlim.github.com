---
title: "[Vue.js] Vue.js 시작하기 ⑤ 라우터"
excerpt: ""
categories: vue
tags: frontend vue.js
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## 라우터
뷰에서 싱글 페이지 어플리케이션을 구현하거나 페이지 간의 이동 기능을 구현할 때 사용하는 라이브러리

### 1. CDN
순서도 중요하다.
```js
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

### 2. 라우터 인스턴스 생성
```js
new VueRouter({ 
    // ...
});
```

### 3. 뷰 인스턴스와 연결하기
```js
new Vue({
    // ...
    router: router, // 라우터 인스턴스를 담은 변수
});
```

정상적으로 뷰 인스턴스와 연결이 되었다면, 뷰 개발자 모드에서 아래와 같이 `$route`가 추가된다.

![router-1](/assets/images/post/20210501/router-1.png)

### 4. 페이지 정보 설정하기
`routes` 에는 페이지의 라우팅 정보가 들어간다. 어떤 url로 이동했을 때 어떤 페이지가 뿌려질지 각 페이지에 대한 정보가 배열로 담긴다. (페이지의 수만큼 객체를 넣어줘야 한다.)
```js
var router = new VueRouter({
    // ...
    routes: [
        // 페이지의 정보
        {
            path: '페이지의 url',
            component: 해당 url에서 표시될 컴포넌트
        },
        // ...
    ]
});
```
<br>

#### Example
```js
var LoginComponent = {
    template: '<div>login</div>'
}
var MainComponent = {
    template: '<div>main</div>'
}

var router = new VueRouter({
    routes: [ 
        // 로그인 페이지 정보    
        {
            path: '/login', // url은 `/login`
            component: LoginComponent, // 컴포넌트 이름은 LoginComponent
        },
        // 메인 페이지 정보
        {
            path: '/main', // url은 `/main`
            component: MainComponent, // 컴포넌트 이름은 MainComponent
        }
    ]
});
```

라우터는 뷰 인스턴스에 등록했기 때문에 `<Root>` 영역에서 유효하며, 페이지의 url이 변경되었을 때 화면에 보여지는 영역은 `<router-view>` 태그로 나타낼 수 있다. `<router-view>` 태그는 뷰 인스턴스에 뷰 라우터를 연결했을 때 사용할 수 있다.

```html
<div id="app">
    <router-view></router-view>
</div>
```

![router-2](/assets/images/post/20210501/router-2.png)

<br>
url이 `/login`일 때, `<router-view>`에 최종적으로 `LoginComponent` 내용이 반영된다.

![router-3](/assets/images/post/20210501/router-3.png)

<br>
url이 `/main`일 때, `<router-view>`에 최종적으로 `MainComponent` 내용이 반영된다.

![router-4](/assets/images/post/20210501/router-4.png)

## 그 외의 유용한 옵션들
### `<router-link>` 태그
사용자에게 url을 이동할 수 있도록 링크를 제공할 때 사용한다. 라우터에서 페이지 이동을 하기 위한 링크 태그로, 최종적으로 `<a>` 태그로 변환된다.

#### Example
```html
<div id="app">
    <div>
        <router-link to="/login">Login</router-link>
        <router-link to="/main">Main</router-link>
    </div>
    <!-- ... -->
</div>
```

### 라우터의 `mode` 속성
라우터 인스턴스의 `mode` 속성에 `history`를 넣어주면 url에 `#`이 없어진다.

## Reference
- <https://www.inflearn.com/course/Age-of-Vuejs/>