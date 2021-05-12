---
title: "[Vue.js] Vue.js 시작하기 ⑦ 템플릿 문법"
excerpt: ""
categories: vue
tags: frontend vue.js 
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## Vue의 템플릿 문법
템플릿 문법은 Vue로 화면을 조작하는 방법을 말한다. (1) 데이터 바인딩과 (2) 디렉티브로 나뉜다.

### 1. 데이터 바인딩
콧수염 괄호(Mushache Tag, `{}`)를 이용한다.

인스턴스에 데이터를 담아놓고, 화면에 출력할 때 사용하는 방식이다.
{% raw %}
```html
<div id="app">
    <p>{{ num }}</p> <!-- [1] -->
    <p>{{ doubleNum }}</p> <!-- [2] -->
</div>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
    new Vue({
        el: '#app',
        data: {
            num: 10,
        },
        computed: { 
            doubleNum: function() {
                return this.num * 2;
            }
        }
    });
</script>
```
{% endraw %}
- [1] : data `num`을 출력한다.
- [2] : computed의 `doubleNum`을 출력한다.

### 2. 디렉티브
html 태그 안에서 일반적으로 사용하는 `id`나 `class` 등 표준적인 속성을 제외하고, "`v-`"라고 붙는 속성들을 뷰 디렉티브라고 한다. "`v-`"라고 붙으면 뷰에서 인식하여 조작한다.

#### (1) `v-bind`
인스턴스에서 관리하고 있는 데이터를 `id`, `class`로 부여하기

```js
data: {
    num: 10,
    uuid: 'abc1234',
    name: 'text-blue',
},
```
{% raw %}
```html
<div id="app">
    <p v-bind:id="uuid" v-bind:class="name">{{ num }}</p>
    <!-- ... -->
</div>
```
{% endraw %}
`v-bind:id`와 `v-bind:class`가 인스턴스의 data에서 관리하는 특정 데이터 값이 연결된다.

화면에서 표현되는 텍스트 데이터뿐만 아니라, DOM에 대한 정보들까지 Reactive하게 바로 반영되어 변경된다. 데이터가 변경될 때마다 `querySelector`를 사용하여 바꿔줄 필요가 없다.

![v-bind](/assets/images/post/20210512/v-bind.png)

<br>

#### (2) `v-if`
"`v-`"가 붙으면 data 속성이나 computed 속성에 둔다.
```js
new Vue({
    // ...
    data: {
        // ...
        loading: true,
    },
```

```html
<div v-if="loading">
    Loading...
</div>
<div v-else>
    test user has benn logged in
</div>
```

`loading` 값이 `true`일 때

![v-if-1](/assets/images/post/20210512/v-if-1.png)

`loading` 값이 `false`일 때

![v-if-2](/assets/images/post/20210512/v-if-2.png)

#### (3) `v-show`
`v-show`에 연결해주는 데이터가 거짓이라면 DOM의 정보가 사라지는 것이 아니라, `style="display: none;` css 속성이 부여된다.

`v-if`는 참/거짓에 따라 DOM 정보 자체가 사라진다.

```html
<div v-show="loading">
    Loading...
</div>
```

`loading` 값이 `true`일 때, `v-if`와 `v-show` 모두 화면에 나타난다.

![v-show-1](/assets/images/post/20210512/v-show-1.png)

`loading` 값이 `false`일 때, 모두 화면의 내용이 달라진다.

![v-show-2](/assets/images/post/20210512/v-show-2.png)

하지만 `v-show` 부분은 실제 DOM에서 사라지지는 않는 것을 확인할 수 있다.

![v-show-3](/assets/images/post/20210512/v-show-3.png)

#### (4) 기타
[Vue 공식사이트](https://vuejs.org/)를 참고

## 키보드/마우스 이벤트 처리 방법
`v-on` 디렉티브와 `methods` 속성을 사용하여 키보드/마우스 이벤트를 처리할 수 있다.

```js
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    new Vue({
        el: '#app',
        methods: {
            logText: function() {
                console.log('clicked');
            }
        }
    })
</script>
```

버튼을 클릭하면 인스턴스 내부의 `logText` 함수가 실행된다.
```html
<div id="app">
    <button v-on:click="logText">click me</button>
</div>
```

<br>
input box에 키보드를 누를 때마다 `logText` 함수가 실행된다.
```html
<input type="text" v-on:keyup="logText">
```

<br>
input box에 엔터를 누를 때마다 `logText` 함수가 실행된다.
```html
<input type="text" v-on:keyup.enter="logText">
```

<br>
`Enter`, `ESC` 등 자주 사용하는 지정자가 정의되어 있으며, 공식 사이트에서 확인 가능하다.

## 기타
### `watch` 속성
기본적으로 데이터를 대상으로 넣을 수 있고, 데이터의 변화에 따라서 특정 로직을 실행할 수 있는 Vue의 속성

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    new Vue({
        el: '#app',
        data: {
            num: 10
        },
        watch: {
            num: function() {
                this.logText();
            }
        },
        methods: {
            addNum: function() {
                this.num = this.num + 1;
            },
            logText: function() {
                console.log('changed');
            }
        }
    });
</script>
```

버튼을 클릭하면 `methods` 내부의 `addNum`가 실행되고, `data` 내부의 `num`의 값이 변한다. `num` 값이 변하기 때문에 `watch` 내부의 함수가 동작하고, `logText` 함수가 실행된다.
{% raw %}
```html
<div id="app">
    {{ num }}
    <button v-on:click="addNum">increase</button>
</div>
```
{% endraw %}

### `watch` 속성 vs `computed` 속성
`computed` 속성은 로직이 실행될 때 해당 데이터를 기준으로 실행된다. 단순한 값에 대한 계산

반면에 `watch`는 데이터가 변할 때, 실행된다. 무거운 로직, 매번 실행되는게 부담스러운 로직에 대하여 `methods`에 정의한 함수와 엮어주는게 좋다.

공식 사이트에 따르면 일반적인 경우에 `computed`를 사용하는 것이 적합하다고 한다.

### 동적으로 `class` 할당하기
#### 1. `data` 속성을 사용하는 방법
```css
<style>
.warning {
    color: red;
}
</style>
```

```js
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    new Vue({
        el: '#app',
        data: {
            isError: false
        }
    })
</script>
```

`isError`의 값이 `true`일 때, `warning` 클래스가 들어가고, `false`라면 들어가지 않는다.
```html
<div id="app">
    <p v-bind:class="{ warning: isError }">Hello</p>
</div>
```

![use-computed-1](/assets/images/post/20210512/use-computed-1.png)

![use-computed-2](/assets/images/post/20210512/use-computed-2.png)

#### 2. `computed` 속성을 사용하는 방법
`computed` 내부에서 삼항 연산자를 사용하여 `isError`가 `true`라면 반환할 클래스 이름을 작성하고, `v-bind`를 사용하여 클래스 바인딩에 엮을 수 있다.
```js
new Vue({
    // ...
    computed: {
        errorTextColor: function() {
            return this.isError ? 'warning' : null; // [1]
        }
    }
});
```
- [1] : `isError`가 `true`라면 `warning`(클래스 이름), `false`라면 `null`을 반환한다.

```html
<p v-bind:class="errorTextColor">Hello</p>
```


## References
- <https://www.inflearn.com/course/Age-of-Vuejs/>