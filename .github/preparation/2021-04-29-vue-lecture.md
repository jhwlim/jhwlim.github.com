# 뷰의 템플릿 문법
뷰로 화면을 조작하는 방법을 의미한다. 

템플릿 문법은 크게 데이터 바인딩과 디렉티브로 나눈다.

## 1. 데이터 바인딩

콧수염 괄호(Mustache Tag)를 이용한다.
인스터스의 데이터를 담아놓고, 화면에 출력할 때 사용하는 방식

```html
<div id="app">
    <p>{{ num }}</p>
    <p>{{ doubleNum }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
    new Vue({
        el: '#app',
        data: {
            num: 10,
        },
        computed: { // 데이터의 값에 따라서 바뀌는 값을 정의할 때 사용하는 속성
            doubleNum: function() {
                return this.num * 2;
            }
        }
    });
</script>
```

화면
#### 3번 이미지

## 2. 디렉티브
html 태그에서 일반적인 id나 class 등 표준적인 속성을 제외하고, 
`v-`라고 붙는 속성들을 모두 뷰 디렉티브라고 한다.
`v-`라고 붙으면 뷰에서 인식하여 조작한다.

만약 인스턴스에서 관리하고 있는 데이터를 아이디로 부여하고 싶다면,

```js
data: {
    num: 10,
    uuid: 'abc1234',
    name: 'text-blue',
},
```

```html
<div id="app">
    <p v-bind:id="uuid" v-bind:class="name">{{ num }}</p>
    <!-- ... -->
</div>
```

결과
#### 5번이미지

`v-bind:id`와 `v-bind:class`가 인스턴스의 data에서 관리하는 특정 데이터의 값이 연결이 된다.

단지 화면에서 표현되는 텍스트 데이터 뿐만 아니라, DOM에 대한 정보들까지 Reactive하게 바로 반영되어 변경된다. 이전처럼 일일히 데이터가 변경되었을 때 queryselector를 사용하여 바꿔줄 필요가 없어진다.

### 기타 유용한 디텍티브
### `v-if`
```html
<div v-if="loading">
    Loading...
</div>
<div v-else>
    test user has benn logged in
</div>
```

`v-`가 붙으면 data 속성이나 computed 속성을 두게 된다.
```js
new Vue({
    // ...
    data: {
        // ...
        loading: true,
    },
```

#### 9번 이미지
#### 8번 이미지

### `v-show`
v-if 와 유사하다.

v-if 는 참/거짓에 따라 DOM 정보자체가 사라진다.

하지만 v-show는 거짓이라면 DOM의 정보가 사라지는 것이 아니라, css style="display: none;" 처리가 되는 것의 차이가 있다.

#### Example
```html
<div v-show="loading">
    Loading...
</div>
```

#### 10번 이미지, 11번 이미지, 12번 이미지

### 공식문서를 보고 해결하는 방법

공식사이트 <vuejs.org>에도 잘 설명되어 있음.


TODO: 인풋 박스를 만들고 입력된 값을 p태그에 출력해보세요
```js
new Vue({
    // ...
    data: {
        // ...
        message: ''
    },
}
```

```html
<!--  -->
<input type="text"  v-model="message">
<p>{{ message }}</p>
```

## methods 속성과 v-on 디렉티브를 이용한 키보드, 마우스 이벤트 처리 방법

```html
<div id="app">
    <button v-on:click="logText">click me</button>
</div>

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

클릭하면 인스턴스 내부의 logText 함수가 실행되어 콘솔에 표시된다.


인풋박스에 키보드를 누를때마다 logText함수가 실행된다.
```html
<input type="text" v-on:keyup="logText">
```

인풋박스에 엔터를 누를때마다 logText함수가 실행된다.
```html
<input type="text" v-on:keyup.enter="logText">
```
이벤트 모디파이어 enter, esc 등 지정자들이 있고 공식문서에서 확인 가능함.

## watch 속성
- 기본적으로 데이터를 대상으로 넣을 수 있고,
- 데이터의 변화에 따라서 특정 로직을 실행할 수 있는 뷰의 속성

#### Example
```html
<div id="app">
    {{ num }}
    <button v-on:click="addNum">increase</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    new Vue({
        el: '#app',
        data: {
            num: 10
        },
        watch: { // 기본적으로 데이터를 대상으로 넣을 수 있고, 데이터의 변화에 따라서 특정 로직을 실행할 수 있는 뷰의 속성
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

## watch 속성과 computed 속성의 차이점

```js
new Vue({
    // ...
    data: {
        num: 10
    },
    computed: {
        doubleNum: function() {
            return this.num * 2;
        }
    }
});
```

computed

로직이 실행될때 해당 데이터를 기준으로 실행된다.
단순한 값에 대한 계산

watch
무거운 로직들, 매번 실행되는게 부담스러운 로직들, methods에 있는 내용을 엮어주는게 좋다.

```js
new Vue({
    // ...
    watch: {
        num: function(newValue, oldValue) {
            this.fetchUserByNumber(newValue);
        }
    },
    methods: {
        fetchUserByNumber: function(num) {
            console.log(num);
            // axios.get(num);
        }
    }
});
```

공식문서에 따르면 computed가 일반적인 경우에는 적합하다.

### computed 속성을 이용한 클래스 코드 작성 방법

```html
<style>
.warning {
    color: red;
}
</style>
```

```html
<div id="app">
    <p v-bind:class="{ warning: isError }">Hello</p>
</div>

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



p 태그의 클래스는 isError가 true일 때는 warning 클래스가 들어가고, false라면 클래스가 들어가지 않는다.

#### 13, 14번 이미지


```html
<p v-bind:class="{ warning: isError }">Hello</p>
```

대신에 삼항연산자를 이용하여 아래와 같이 나타낼 수도 있다.
```js
new Vue({
    // ...
    computed: {
        errorTextColor: function() {
            return this.isError ? 'warning' : null;
        }
    }
});
```

클래스 바인딩에 엮을 수 있다.
```html
<p v-bind:class="errorTextColor">Hello</p>
```

위와 동일한 결과가 나타난다.

# Vue CLI
CLI란 Command Line Interface의 약자, 명령어를 통한 특정 액션을 수행하는 도구 (명령어 실행 도구)

## 설치

VS Code에서 터미널 -> 새 터미널 or `Ctrl` + `~`

```sh
node -v
```

node.js 버전 확인 10버전 이상

```sh
npm -v
```

npm 6버전 이상

https://cli.vuejs.org/

Get Started 버튼 클릭

Installation 클릭 -> npm 명령어 치기

```sh
npm install -g @vue/cli
```

설치되면 아래와 같이 버전이 나온다.

#### 15번 이미지

### 문제점 발생시 문제 해결 방법
퍼미션 에러
- 설치하는 라이브러리가 위치하는 폴더에 파일 쓰기 권한이 없을 경우 발생하는 에러
- 이때는 `sudo`를 붙여서 명령어를 쳐준다.

```sh
sudo npm install -g @vue/cli
```

### 설치되는 곳

%USERPROFILE%\AppData\Roaming\npm\node_modules

## CLI 2버전과 3버전 명령어의 차이점
[Vue CLI 2.x]
vue init '프로젝트 템플릿 유형' '프로젝트 폴더 위치'
vue init webpack-simple '프로젝트 폴더 위치'

[Vue CLI 3.x]
vue create '프로젝트 폴더 위치'

---

뷰 CLI 설치하기

작업 폴더로 터미널 이동하고 아래 명령어 작성

```
vue create vue-cli
```

2버전 선택
#### 16번 이미지

설치 완료
#### 17번 이미지

작업영역 아래에 vue-cli 폴더가 생성된다. 

cd vue-cli 명령어 치고,

npm run serve 실행하면 

vue cli를 이용해서 서비스를 구현하기 위한 기본 구성이 갖춰져있다.

명령어를 실행하면 아래와 같이 나타난다.

#### 18번 이미지

브라우저 화면

#### 19번 이미지

### 폴더 살펴보기
npm : node package manager
- 하는 역할은 package.json에서 라이브러리, 디펜던시에 대한 

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
},
```

npm run serve를 실행하면 vue-cli-service serve가 실행된다.

실행되는 파일은 public 폴더 아래의 index.html

```html
<div id="app"></div>
<!-- built files will be auto injected -->
```

빌드되는 파일이 주석 부분에 자동으로 추가된다는 의미

실제로 src 폴더 아래의 여러가지 파일들이 종합되어 최소한의 파일로 변환되어 주입된다. 내부적으로 웹팩이 돌아가고 있다.

src 폴더 아래의 main.js

```js
new Vue({
  render: h => h(App),
}).$mount('#app')
```

위와 실제로 같다.
```js
new Vue({
    el: '#app',
    render: h => h(App),
})
```

render는 뷰 내부적으로 사용되는 함수로, 템플릿을 속성을 정의했을 때, 내부적으로 render라는 함수가 실행된다.

render의 역할은 App이라는 컴포넌트 즉, 아래의 App.vue 파일이 컴포넌트 파일을 불러와서 집어넣고 render을 했다고 우선 이해하자

```js
import App from './App.vue'
```

## 싱글 파일 컴포넌트 소개

src 폴더 아래에 a.vue 파일 생성하고

```
vue
```

치면 실글 파일 컴포넌트 구조가 자동완성된다.

화면의 영역을 나눴을 때, 특정 영역에 해당하는 HTML, JS, CSS을 한 파일에 관리한다.

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

기존의 작성하던 내용
```js
var appHeader = {
    template: '<div>header</div>',
    method: {
        addNum: function() {
            // ...
        }
    }
}
```

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

<style>
    /* CSS */
</style>
```

## App.vue와 HelloWorld.vue

App.vue 살펴보기

컴포넌트 등록할 때 아래와 같이 vue js 컴포넌트 명명법을 따른다.
`<hello-world></hello-world>`
`<HelloWorld></HelloWorld>`
`<HelloWorld/>`]

#### Example
name : 컴포넌트 이름

```vue
<script>
export default {
  name: 'HelloWorld',
  props: { 
    msg: String // 타입까지 정의해준 것
  },
}
</script>
```

```vue
<script>
export default {
  name: 'HelloWorld',
  props: ['msg'],
}
</script>
```

### 개발 시작하기
1. components 폴더 밑의 HelloWorld.vue 삭제
2. App.vue 다 지우고, vue 자동완성
3. template 안에 div 태그 생성
- template이라는 속성은 최상위 레벨에 하나의 html 요소만 있어야 한다.
- 아래와 같이 사용할 수 없다.
```vue
<template>
  <div>

  </div>
  <div>
    
  </div>
</template>
```

아래와 같이 작성하고, 브라우저로 가면
```vue
<template>
  <div>
    app
  </div>
</template>
```

#### 21번 이미지

뷰에서는 아래와 같이 data를 정의해줘야 한다. 
컴포넌트가 재사용되기때문에 여러개의 컴포넌트에서 동일한 값을 공유하면 안되기 때문에 아래와 같이 function ~ return 형식으로 작성해줘야 한다.
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
```

```vue
<template>
  <div>
    {{ str }}
  </div>
</template>
```

## 싱글 파일 컴포넌트 체계에서 컴포넌트 등록하기
components 폴더 아래에 `AppHeader.vue` 파일 생성 (파일 이름은 파스칼 케이스(대문자시작), 두단어 이상 조합할 것!)

html 표준 태그인지 기본적으로 브라우저가 구분할 수 있도록, 충돌 나지 않도록!

```vue
<template>
  <header>
      <h1>Header</h1>
  </header>
</template>
```

App.vue에서 appHeader.vue 컴포넌트 사용하기 위해서 import 해줘야 한다.
```vue
<script>
import AppHeader from './components/AppHeader.vue';
export default {
  // ...
  components: {
    'app-header': AppHeader
  }
}
</script>
```

```vue
<template>
  <div>
    <app-header></app-header>
  </div>
</template>
```

#### 22번 이미지

## props 사용하기

App.vue
```vue
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
```

AppHeader.vue
```vue
<script>
export default {
    props: ['propsdata']
}
</script>
```

App.vue
```vue
<template>
  <div>
    <!-- <app-header v-bind:하위 컴포넌트의 프롭스 속성 이름="상위 컴포넌트의 데이터 이름"></app-header> -->
    <app-header v-bind:propsdata="str"></app-header>
  </div>
</template>
```

AppHeader.vue
```vue
<template>
  <header>
      <h1>{{ propsdata }}</h1>
  </header>
</template>
```

## event emit 구현하기

AppHeader.vue
```vue
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
```

```vue
<template>
  <header>
      <!-- ... -->
      <button v-on:click="sendEvent">send</button>
  </header>
</template>
```

App.vue
```vue
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

```vue
<template>
  <div>
    <app-header 
        v-bind:propsdata="str" 
        v-on:renew="renewStr"></app-header>
  </div>
</template>
```

# 프로젝트 - 사용자 입력 폼 만들기
vue-form 프로젝트 생성

```
vue create vue-form
```

App.vue
```vue
<template>
  <form>
    <div>
      <label for="username">id : </label>
      <input id="username" type="text">
    </div>
    <div>
      <label for="password">pw : </label>
      <input id="password" type="password">
    </div>
    <button>login</button>
  </form>
</template>

<script>
export default {

}
</script>

<style>

</style>
```

#### 24번 이미지

```html
<input id="username" type="text" v-model="username">
```

```html
<input id="password" type="password" v-model="password">
```

```vue
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
```

#### 25번 이미지

버튼을 클릭하면 새로고침된다. (form의 기본동작)

일반 JS에서 사용하는 방식
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

뷰에서 사용하는 방식

```html
<form v-on:submit.prevent="submitForm">
```

```js
<script>
export default {
  // ...
  methods: {
    submitForm: function() {
      console.log(this.username, this.password);
    }
  }
}
</script>
```

## 서버에 post로 전송하기
axios나 서드파티 라이브러리를 사용할 때

axios 라이브러리를 사용할 수 있도록 프로젝트에 다운로드 받는다.
```sh
npm i axios
```

```vue
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

결과 화면
#### 2번 이미지

콘솔
#### 1번 이미지

# 앞으로의 학습 방향

공식문서 vuejs.org

Learn - Guide, API, Style Guide(코드를 어떻게 작성해야하는지), CookBook(구현하면서 겪는 실용적인 문법, 고민들)

Vuex, Vue Router
