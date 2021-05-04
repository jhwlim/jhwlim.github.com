---
title: "[Vue.js] Vue.js 시작하기 ③ Vue 인스턴스와 컴포넌트"
excerpt: ""
categories: vue
tags: frontend vue.js
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## Vue CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

## Vue 인스턴스
### 1. 인스턴스 생성
```js
var vm = new Vue();
```

크롬 개발자 도구에서 인스턴스의 내용과 뷰에서 제공하는 속성을 확인할 수 있다.

![vue-instance-1](/assets/images/post/20210429/vue-instance-1.png)

#### Example
```html
<div id="app"></div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    var vm = new Vue({
        el: '#app',  // [1]
        data: {
            message: 'hi'
        }
    });
</script>
```

- [1] : `<body>` 안에서 `app`이라는 아이디를 가진 태그를 찾아서 인스턴스를 붙이겠다는 의미로, 반드시 특정 태그를 붙여줘야만 Vue에서 제공하는 기능을 사용할 수 있다.

생성된 인스턴스는 `<Root>`를 의미하며, 아래와 같이 뷰 개발자 모드에서 내용을 확인할 수 있다. 

![vue-instance-2](/assets/images/post/20210429/vue-instance-2.png)

### 2. 생성자 함수란
자바스크립트에서는 생성자 함수를 이용하여 인스턴스(정보를 담은 객체)를 생성할 수 있다. 함수의 이름의 첫 글자가 대문자라면 일반적으로 생성자 함수를 의미한다.

#### Example

![js-instance-1](/assets/images/post/20210429/js-instance-1.png)

![js-instance-2](/assets/images/post/20210429/js-instance-2.png)

![js-instance-3](/assets/images/post/20210429/js-instance-3.png)

생성자 함수에 미리 `logText` 라는 함수를 정의해놓는다면, 해당 생성자 함수를 이용해서 객체를 생성하면 매번 함수를 새로 정의하지 않고, 미리 정의된 `logText` 라는 함수를 가져다 쓸 수 있다.

![js-instance-4](/assets/images/post/20210429/js-instance-4.png)

![js-instance-5](/assets/images/post/20210429/js-instance-5.png)

![js-instance-6](/assets/images/post/20210429/js-instance-6.png)

뷰는 이러한 생성자 함수 형태로 API와 속성을 미리 정의해놓았기 때문에 `new Vue()` 형태로 사용할 수 있다.

## Vue 컴포넌트
### 1. 컴포넌트란
화면을 구성하는 영역을 의미하며, 컴포넌트를 활용하면 화면의 영역별로 구분하여 코드를 관리함으로써 재사용성이 높일 수 있다.

인스턴스를 생성하면 `<Root>` 컴포넌트로 인식된다. (뷰 개발자 모드에서 확인 가능)

### 2. 전역 컴포넌트 등록하기
```js
Vue.component('컴포넌트 이름', 컴포넌트 내용)
```

#### Example
```html
<div id="app">
    <app-header></app-header>
    <app-content></app-content>
</div>
    
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    Vue.component('app-header', {   // [1]
        template: '<h1>Header</h1>'
    });

    Vue.component('app-content', {  // [2]
        template: '<div>content</div>'
    });

    new Vue({
        el: '#app'
    });
</script>
```
- [1] : `<app-header>` 이름의 전역 컴포넌트를 등록한다.
- [2] : `<app-content>` 이름의 전역 컴포넌트를 등록한다.

뷰 개발자 모드

![static-component-1](/assets/images/post/20210429/static-component-1.png)

화면

![static-component-2](/assets/images/post/20210429/static-component-2.png)

<br>

### 3. 지역 컴포넌트 등록하기
```js
new Vue({
    // ...
    components: {
        '컴포넌트 이름': 컴포넌트 내용
    }
})
```

#### Example
```js
new Vue({
    el: '#app',
    components: {
        'app-footer': {
            template: '<footer>footer</footer>'
        }
    }
});
```

```html
<div id="app">
    <!-- ... -->
    <app-footer></app-footer>
</div>
```

뷰 개발자 모드

![local-component-1](/assets/images/post/20210429/local-component-1.png)

화면

![local-component-2](/assets/images/post/20210429/local-component-2.png)

<br
>

### 4. 전역 컴포넌트와 지역 컴포넌트의 차이점
전역 컴포넌트는 대부분 플러그인이나 라이브러리 형태로 전역에서 사용하는 경우에 주로 사용한다.

지역 컴포넌트는 `components`로 's'가 붙는다. 또한, 특정 컴포넌트 하단에 어떤 컴포넌트가 있는지 알 수 있다.

#### 컴포넌트와 인스턴스의 관계
인스턴스는 `new Vue()`를 이용해서 여러개 생성할 수 있다. 새로운 인스턴스가 생성되면 `<Root>`도 추가되는 것을 확인할 수 있다.

![another-vue-instance](/assets/images/post/20210429/another-vue-instance.png)

전역 컴포넌트는 인스턴스를 새로 생성할 때마다 다시 등록할 필요 없이 재사용이 가능하다. 하지만 지역 컴포넌트는 인스턴스마다 새로 생성해줘야한다.

#### Example
새로운 Vue 인스턴스를 생성하여 위에서 생성하였던 전역 컴포넌트와 지역 컴포넌트를 등록하면

```html
<div id="app2">
    <app-header></app-header>
    <app-footer></app-footer>
</div>
```

```js
new Vue({
    el: '#app2',
});
```

뷰 개발자 모드에서 전역 컴포넌트만 등록이 되고, 다른 인스턴스에서 생성하였던 지역 컴포넌트는 등록이 안되어 있는 것을 확인할 수 있다.

![compare-static-and-local-component](/assets/images/post/20210429/compare-static-and-local-component.png)

<br>
실제로는 서비스를 구현할 때는 <u>하나의 인스턴스를 생성하고, 그 안에서 컴포넌트를 붙여나가는 방식을 사용하기 때문에 지역 컴포넌트를 많이 사용한다.</u>

## Reference
- <https://www.inflearn.com/course/Age-of-Vuejs/>