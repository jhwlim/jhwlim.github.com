---
title: "[Vue.js] Vue.js 시작하기 ⑧ Vue CLI"
excerpt: ""
categories: vue
tags: frontend vue.js 
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## Vue CLI
**CLI**(Command Line Interface)는 명령어를 통한 특정 액션을 수행하는 도구 (명령어 실행 도구)

### 설치 전 확인사항
node.js version 10 이상
```sh
node -v
```

npm version 6 이상
```sh
npm -v
```

### 설치
[공식사이트 참고](https://cli.vuejs.org/guide/installation.html)

```sh
npm install -g @vue/cli
```

### Permission Error 문제 해결방법
설치하는 라이브러리가 위치하는 폴더에 파일 쓰기 권한이 없는 경우 발생하는 에러

명령어 앞에 `sudo` 를 붙여서 실행한다.
```sh
sudo npm install -g @vue/cli
```

## Project 생성하기
작업 폴더로 이동하여 명령어 실행
```sh
vue create 프로젝트이름
```

2버전을 선택한다.

![create-vue-project-1](/assets/images/post/20210522/create-vue-project-1.png)

설치가 완료되면 해당 작업 폴더에 위에서 입력한 '프로젝트이름' 폴더가 생성된다.

![create-vue-project-2](/assets/images/post/20210522/create-vue-project-2.png)

해당 폴더로 이동하여 아래의 명령어를 실행하면 서버가 실행된다.
```sh
cd 프로젝트이름
npm run serve
```

포트번호 8080에서 실행되고 있음을 확인할 수 있다.

![create-vue-project-3](/assets/images/post/20210522/create-vue-project-3.png)

브라우저에서 접속하여 확인하면 아래와 같은 화면이 나타난다.

![create-vue-project-4](/assets/images/post/20210522/create-vue-project-4.png)

## Project 살펴보기
### package.json
```json
/* package.json */
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
},
```

`npm run serve`를 실행하면 실제로는 `vue-cli-service serve` 명령어가 실행된다.
이때, public 폴더 아래의 index.html이 실행된다.

또한 package.json에서 의존성을 관리한다.
```json
"dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11"
},
```

### index.html
```html
<!-- index.html -->
<div id="app"></div>
<!-- built files will be auto injected -->
```

빌드되는 파일이 주석 부분에 자동으로 추가된다. 실제로 src 폴더 아래의 여러가지 파일들이 종합되어 최소한의 파일로 변환되어 주입된다. 내부적으로는 웹팩이 동작하고 있다.

### main.js
```js
// main.js
new Vue({
  render: h => h(App),
}).$mount('#app')
```

실제로 아래의 코드는 위의 코드와 동일하다.
```js
new Vue({
    el: '#app',
    render: h => h(App),
})
```

`render`는 Vue 내부에서 사용되는 함수로, 템플릿 속성을 정의했을 때, 내부적으로 `render` 함수가 실행된다. 
위의 코드는 '#app'에 'App' 컴포넌트를 붙이겠다고 우선 이해하면 될 것 같다.

## 싱글 파일 컴포넌트
### 싱글 파일 컴포넌트란
`.vue` 확장자 파일을 말한다.

화면의 영역을 나눴을 때, 특정 영역에 해당하는 HTML, CSS, JS를 하나의 파일에서 관리한다.

```vue
<template>
<!-- HTML -->
</template>

<script>
export default {
// Javascript
}
</script>

<style>
/* CSS */
</style>
```

<br>
이전에 자바스크립트 파일에서는 작성했던 내용을 `.vue` 파일에서 작성하면 아래와 같다.
```vue
<template>
  <div>header</div>
</template>

<script>
export default {
    // Javascript, 인스턴스 옵션 속성 or 컴포넌트 옵션 속성
    method: {
        addNum: function() {
            // ...
        }
    }
}
</script>
```

```js
// 이전에 자바스크립트에서 작성했던 내용
var appHeader = {
    template: '<div>header</div>',
    method: {
        addNum: function() {
            // ...
        }
    }
}
```


### Code Convention
`.vue` 파일 이름은 두 단어 이상을 조합하여 파스칼 케이스(대문자 시작)로 작성한다. (html 표준 태그 인지 브라우저가 구분하기 위해서)

컴포넌트를 등록할 때는 아래와 같이 Vue.js 컴포넌트 명명법을 따른다.

```vue
<hello-world></hello-world>
<HelloWorld></HelloWorld>
<HelloWorld/>
```

## 싱글 파일 컴포넌트 사용하기
### template
template 안에서는 최상위 레벨에 하나의 html 요소만 있어야한다.
```vue
<template>
  <div>
    <!-- ... -->
  </div>
</template>
```

<br>
아래와 같이 사용할 수 없다.
```vue
<template>
  <div>
    <!-- ... -->
  </div>
  <div>
    <!-- ... -->
  </div>
</template>
```

### data
data를 정의할 때는 아래와 같이 함수 형식으로 정의해야 한다. 컴포넌트는 재사용되기 때문에 여러 개의 컴포넌트에서 동일한 값을 공유하면 안된다. 따라서 아래와 같이 function ~ return 형식으로 작성해야 한다.
```vue
<script>
export default {
  data: function() {
    return {
      str: 'hi',
    }
  }
}
</script>

<template>
  <div>
    {{ str }}   <!-- hi -->
  </div>
</template>
```

### 컴포넌트 등록하기
상위 컴포넌트에서 `import`하고 컴포넌트를 등록하여 `<template>` 내부에서 사용하면 된다.
```vue
<!-- AppHeader.vue -->
<template>
  <header>
      <h1>Header</h1>
  </header>
</template>
```

```vue
<!-- App.vue -->
<script>
import AppHeader from './components/AppHeader.vue';
export default {
  // ...
  components: {
    'app-header': AppHeader
  }
}
</script>

<template>
  <div>
    <app-header></app-header>
  </div>
</template>
```

### props 사용하기
```vue
<!-- App.vue -->
<script>
export default {
  data: function() {
    return {
      str: 'Header',
    }
  },
  // ...
}
</script>

<template>
  <div>
    <app-header v-bind:propsdata="str"></app-header>
  </div>
</template>
```

```vue
<!-- AppHeader.vue -->
<script>
export default {
    props: ['propsdata']  // Header
}
</script>
```

### event emit 구현하기
`send` 버튼을 클릭하면 `sendEvent` 메서드가 실행되고, `renew` 이벤트가 발생한다.
```vue
<!-- AppHeader.vue -->
<script>
export default {
    // ...
    methods: {
        sendEvent: function() {
            this.$emit('renew');
        }
    }
}
</script>

<template>
  <header>
      <!-- ... -->
      <button v-on:click="sendEvent">send</button>
  </header>
</template>
```

`renew` 이벤트가 발생하면 `renewStr` 메서드가 동작하여 data의 str이 'hi'로 바뀐다. str이 바뀌었기 때문에 props로 연결되어 있는 하위 컴포넌트의 값이 바뀌게 된다.
```vue
<template>
  <div>
    <app-header 
        v-bind:propsdata="str" 
        v-on:renew="renewStr"></app-header>
  </div>
</template>

<script>
export default {
  // ...
  methods: {
    renewStr: function() {
      this.str = 'hi';
    }
  }
}
</script>
```

## References
- <https://www.inflearn.com/course/Age-of-Vuejs/>