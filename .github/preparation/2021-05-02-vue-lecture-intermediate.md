# 0. 강의 오리엔테이션
## 1. 강의소개
## 2. 개발 환경 설정 및 깃헙 리포지토리 클론
VSCode 플러그인 설치
- Vetur
- TSLint : 뷰를 개발하다가 중간에 문법 오류 또는 해당 API를 쫓아들어갈때 유용하게 사용된다.

# 1. Todo App - 프로젝트 소개 및 구성
## 1. 뷰 CLI로 프로젝트 생성하기
```
vue create vue-todo
```

#### 1번 이미지

#### 3번 이미지

## 2. 프로젝트 소개 및 컴포넌트 설계 방법
```
<Root>
    <App>
        <TodoHeader>
        <TodoInput>
        <TodoList>
        <TodoFooter>
```

# 2. Todo App - 프로젝트 구현
## 컴포넌트 생성 및 등록하기
TodoHeader.vue, TodoInput.vue, TodoList.vue, TodoFooter.vue 파일 생성한다. 그리고 각각 아래와 같은 형식으로 내용을 작성한다.

```js
<template>
  <div>
      header
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
```

생성한 컴포넌트를 App.vue에서 붙여준다.

```js
<template>
  <div id="app">
    <TodoHeader></TodoHeader>
    <TodoInput></TodoInput>
    <TodoList></TodoList>
    <TodoFooter></TodoFooter>
  </div>
</template>

<script>
import TodoHeader from './components/TodoHeader.vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFooter from './components/TodoFooter.vue'


export default {
  name: 'App',
  components: {
    'TodoHeader': TodoHeader,
    'TodoInput': TodoInput,
    'TodoList': TodoList,
    'TodoFooter': TodoFooter,
  }
}
</script>

<style>
</style>

```

#### 4번 이미지

## 2. 파비콘, 아이콘, 폰트, 반응형 태그 설정하기

public 폴더 아래의 `index.html`

뷰 포트 메타 태그
- 이 웹사이트가 반응형 웹이다 라는 것을 설정한다.
- 너비가 해당 기기의 너비만큼, 배열은 1이다.
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

파비콘 
- favicon generator 사이트에서 생성할 수 있다.

파비콘을 생성하여 폴더에 넣고 아래의 태그를 추가한다. 이때, `href`는 파비콘 파일의 경로를 넣어준다.

```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
```

어썸아이콘

```html
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
```

구글 폰트 우분투 추가

```html
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
```

## 3. TodoHeader 컴포넌트 구현

```vue
<template>
  <header>
    <h1>TODO it!</h1>
  </header>
</template>
```

뷰 싱글 파일컴포넌트에서 지원하는 속성

scoped

- 해당 컴포넌트 안에서만 유효한 스타일 속성

```vue
<style scoped>
h1 {
  color: #2F3B52;
  font-weight: 900;
  margin: 2.5rem 0 1.5rem;
}
</style>
```

전체 페이지 적용을 위해 App.vue에 아래의 내용 추가
```html
<style>
body {
  text-align: center;
  background-color: #F6F6F6;
}

input {
  border-style: groove;
  width: 200px;
}

button {
  border-style: groove;
}

.shadow {
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.03);
}
</style>
```

#### 5번 이미지