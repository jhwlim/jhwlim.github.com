---
title: "[Vue.js] Vue.js 시작하기 ④ 컴포넌트 통신"
excerpt: ""
categories: vue.js
tags: frontend vue.js
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## 컴포넌트 통신의 필요성
컴포넌트를 활용하여 영역별로 코드를 관리하면 컴포넌트간 관계가 생긴다. 뷰 컴포넌트는 각각 데이터를 관리하기 때문에 데이터 유효범위를 갖는다. 따라서 컴포넌트간 데이터를 공유하려면 **props**와 **event**를 이용해야한다.

- 상위 컴포넌트 → 하위 컴포넌트 : props를 전달하여 데이터를 내려준다.
- 하위 컴포넌트 → 상위 컴포넌트 : event를 발생시켜 데이터를 올려준다.

## 컴포넌트 통신 방법
### 1. props
상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달할 때 사용한다.
```html
<하위-컴포넌트-태그 v-bind:props 속성 이름 = "상위 컴포넌트의 데이터 이름"></하위-컴포넌트-태그>
```

#### Example
```html
<div id="app">
    <app-header></app-header>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    var appHeader = {
        template: '<h1>header</h1>'
    };

    new Vue({
        el: '#app',
        components: {
            'app-header': appHeader,
        },
        data: {
            message: 'h1'
        }
    });
</script>
```

상위 컴포넌트에서 데이터를 받을 props 속성의 이름을 배열 형식으로 정의한다.
```js
var appHeader = {
    template: '<h1>header</h1>',
    props: ['propsdata']    
};
```

`<Root>`의 `message` 데이터를 내려준다.
```html
<div id="app">
    <app-header v-bind:propsdata = "message"></app-header>
</div>
```

`<Roor>`의 데이터를 변경하면 `<app-header>`의 props 값도 바뀌는 것을 확인할 수 있다.

![props-1](/assets/images/post/20210501/props-1.png)

![props-2](/assets/images/post/20210501/props-2.png)

`{{ }}` 데이터 이름이나 props 이름을 넣어주면 해당 값이 반영되어 화면에 나타난다.
```js
var appHeader = {
    template: '<h1>{{ propsdata }}</h1>',
    props: ['propsdata']
};
```
<br>

### 2. Event
하위 컴포넌트에서 상위 컴포넌트로 이벤트를 발생시켜 데이터를 전달한다.
```html
<하위-컴포넌트-태그 v-on:하위 컴포넌트에서 발생한 이벤트 이름="상위 컴포넌트의 메서드 이름"></하위-컴포넌트-태그>
```

#### Example
```html
<div id="app">
    <app-header></app-header>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    var appHeader = {
        template: '<button>click me</button>'
    }

    new Vue({
        el: '#app',
        components: {
            'app-header': appHeader
        }
    });
</script>
```

`click me` 버튼을 클릭하면 `passEvent` 메서드를 실행한다.
```js
var appHeader = {
    template: '<button v-on:click="passEvent">click me</button>',
    methods: {
        passEvent: function() {
            this.$emit('pass'); // [1]
        }
    }
}
```
- [1] : `pass` 라는 이름의 이벤트를 발생시킨다. (상위 컴포넌트에서 감지할 이벤트 이름)

<br>
뷰 개발자 의 `Events` 탭에서 발생하는 이벤트 로그를 확인할 수 있다.

![event-1](/assets/images/post/20210501/event-1.png)

이벤트가 발생했을 때 실행할 함수를 정의한다.
```js
new Vue({
    el: '#app',
    components: {
        'app-header': appHeader
    },
    methods: {
        logText: function() {   // 메서드 정의
            console.log('hi');
        }
    }
});
```

하위 컴포넌트에서 발생한 이벤트를 상위 컴포넌트에서 잡아준다.
```html
<div id="app">
    <app-header v-on:pass="logText"></app-header>
</div>
```

![event-2](/assets/images/post/20210501/event-2.png)

### 3. 같은 레벨의 컴포넌트 통신 방법
같은 레벨에 데이터를 보내기 위해서는 event를 통해 상위 컴포넌트에 데이터를 넘겨주고, 그 데이터를 props를 통해 다시 자식 컴포넌트로 전달해준다.

#### Example
`pass` 버튼을 클릭하면 `pass`라는 이벤트가 발생한다.
```html
<div id="app">
    <app-header></app-header>
    <app-content></app-content>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    var appHeader = {
        template: '<div>header</div>'
    }
    
    var appContent = {
        template: '<div>content<button v-on:click="passNum">pass</button></div>',
        methods: {
            passNum: function() {
                this.$emit('pass', 10); // pass 라는 이벤트로 10을 넘긴다.
            }
        }
    }

    new Vue({
        el: '#app',
        components: {
            'app-header': appHeader,
            'app-content': appContent,
        }
    });
</script>
```

`pass` 버튼을 클릭하면 payload로 10이 들어오는 것을 뷰 개발자 모드에서 확인 가능하다.

![payload](/assets/images/post/20210501/payload.png)

이벤트를 통해 넘어온 데이터를 받을 함수를 정의하고, 연결해준다.
```js
new Vue({
    // ...
    data: {
        num: 0,
    },
    methods: {
        deliverNum: function(value) {   // value : 전달받은 인자
            this.num = value;
        }
    },
});
```

```html
<div id="app">
    <!-- ... -->
    <app-content v-on:pass="deliverNum"></app-content>
</div>
```

처음 화면을 실행했을 때의 `<Root>`의 `num`의 값은 0 이다.

![same-component-1](/assets/images/post/20210501/same-component-1.png)

`pass` 버튼을 클릭하면 `num`의 값이 10으로 바뀌게 된다.

![same-component-2](/assets/images/post/20210501/same-component-2.png)

<br>
상위 컴포넌트에서 데이터를 받을 수 있도록 하위 컴포넌트의 props를 정의하고, 연결해준다.

```js
var appHeader = {
    // ...
    props: ['propsdata']
}
```

```html
<div id="app">
    <app-header v-bind:propsdata="num"></app-header>
    <!-- ... -->
</div>
```

뷰 개발자 모드에서 `<app-content>`를 확인해보면 `<Root>`의 `num`값이 넘어온것을 확인할 수 있다.

![same-component-3](/assets/images/post/20210501/same-component-3.png)

<br>

## ※ 인스턴스에서의 `this`
`this`는 인스턴스의 data 내부의 변수를 가리킨다.

```js
var vm = new Vue({
    el: '#app',
    data: {
        nums: 10
    }
});
```

`nums`는 `data` 안에 선언했지만, 내부 동작에 의해서 실제로는 바깥에 나타나기 때문에 `this.nums`을 통해서 `data` 안에서 선언한 `nums` 데이터에 접근할 수 있다. 크롬 개발자 도구에서 확인 가능하다.

![this](/assets/images/post/20210501/this.png)

## Reference
- <https://www.inflearn.com/course/Age-of-Vuejs/>