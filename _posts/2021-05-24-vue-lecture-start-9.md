---
title: "[Vue.js] Vue.js 시작하기 ⑨ 사용자 입력 Form 만들기"
excerpt: ""
categories: vue
tags: frontend vue.js 
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## 사용자 기본 입력 Form
```vue
/* App.vue */
<script>
export default {
  data: function() {
    return {
      username: '',
      password: '',
    }
  }
}
</script>

<template>
  <form>
    <div>
      <label for="username">id : </label>
      <input id="username" type="text" v-model="username">
    </div>
    <div>
      <label for="password">pw : </label>
      <input id="password" type="password" v-model="password">
    </div>
    <button>login</button>
  </form>
</template>
```
<br>
화면 결과

![form-1](/assets/images/post/20210524/form-1.png)

<br>

### ※ form의 새로고침을 막는 방법
**1. JS에서 사용하는 방식**

```html
<form v-on:submit="submitForm">
```

```js
export default {
  // ...
  methods: {
    submitForm: function(event) {
      event.preventDefault(); // form의 새로고침을 막는 방법
      console.log(this.username, this.password);
    }
  }
}
```

**2. Vue에서 사용하는 방식**

```html
<form v-on:submit.prevent="submitForm">
```

```js
export default {
  // ...
  methods: {
    submitForm: function() {
      console.log(this.username, this.password);
    }
  }
}
```

## 서버에 post 요청하기
axios 설치
```sh
npm install axios
```

```vue
/* App.vue */
<script>
import axios from 'axios';

export default {
  // ...
  methods: {
    submitForm: function() {
      // ...
      var url = 'https://jsonplaceholder.typicode.com/users';
      var data = {
        username: this.username,
        password: this.password,
      }
      axios.post(url, data)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
}
</script>
```

<br>
화면 결과

![result-1](/assets/images/post/20210524/result-1.png)

![result-2](/assets/images/post/20210524/result-2.png)

## 앞으로의 학습 방향
- 공식문서 vuejs.org
- Learn - Guide, API, Style Guide(코드를 어떻게 작성해야하는지), CookBook(구현하면서 겪는 실용적인 문법)
- Vuex, Vue Router

## References
- <https://www.inflearn.com/course/Age-of-Vuejs/>