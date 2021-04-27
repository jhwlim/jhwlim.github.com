---
title: "[Vue.js] Vue.js 시작하기 ② Reactivity"
excerpt: ""
categories: vue.js
tags: frontend vue.js
---
## Introduction
[Vue.js 시작하기 - Age of Vue.js](https://www.inflearn.com/course/Age-of-Vuejs/) 강의를 듣고 배운 내용을 정리하고자 한다.

## Vue.js 는 무엇인가?
MVVM 패턴의 뷰 모델 (View Model) 레이어에 해당하는 화면 (View)단 라이브러리

![about-vue](/assets/images/post/20210426/about-vue.png)

- View는 브라우저에서 사용자에게 보여지는 화면이다. 화면에 나타나는 요소(ex. 버튼, 입력박스 등)는 html이다. html은 DOM을 이용해서 자바스크립트로 조작할 수 있다.
- **DOM Listener**는 사용자의 이벤트를 감지하고 자바스크립트의 데이터(Model)를 수정하거나 특정 로직을 수행한다.
- **Data Binding**을 통해서 자바스크립트에 의해 변화된 데이터(Model)를 화면에 반영한다.

## 기존 웹 개발 방식
- HTML은 화면에 나타나는 태그나 DOM에 정보를 넣는 곳이며, 자바스크립트는 태그나 DOM의 내용을 조작할 수 있다.
- 이때, 서버에서 받은 데이터를 바로 넣는 것이 아니라, 변수에 값을 우선 받고 그 변수를 다시 대입하여 화면에 표시한다.
  
    ```html
    <div id="app"></div>

    <script>
        var div = document.querySelector('#app');
        // div.innerHTML = 'Hello World'; 

        var str = 'Hello World!';
        div.innerHTML = str;
    </script>
    ```

- 그런데 이후에 `str` 변수의 값을 수정한다면 수정된 내용은 화면에 반영되지 않는다. 수정된 내용을 화면에 반영하기 위해서는 다시 해당 태그의 정보에 접근해서 수정된 내용을 대입해야 한다.

    ```html
    <script>
        var div = document.querySelector('#app');

        var str = 'Hello World!';
        div.innerHTML = str;

        str = 'Hello World!!!';
        div.innerHTML = str;    // 변경사항을 화면에 반영하기 위해서는 다시 태그에 변수를 대입해줘야 한다.
    </script>
    ```

## Vue.js 방식 - Reactivity
### 1. 일반적인 할당과 접근 방식
- 할당
    ```
    (입력) var a = 10;
    ```

- 접근
    ```
    (입력) a
    (출력) 10
    ```

### 2. Reactivity 할당과 접근 방식
#### Object.defineProperty 란
- 객체의 동작을 재정의하는 API
- 변수 또는 객체의 특정 속성의 동작을 재정의할 수 있다.

    ```js
    Object.defineProperty(대상 객체, 객체의 속성, {
        get: function() {
            // 속성에 접근했을 때의 동작을 정의
        },
        set: function(value) { 
            // 속성에 value를 할당했을 때의 동작을 정의
        }
    });
    ```

#### 예시
- viewModel 객체를 생성하고, 해당 객체의 `str` 속성의 동작을 재정의한다.
  
    ```js
    var div = document.querySelector('#app');
        
    var viewModel = {};

    Object.defineProperty(viewModel, 'str', { 
        get: function() { // viewModel의 'str' 속성에 접근할 때마다 실행된다.
            console.log('접근');
        },
        set: function(newValue) { // viewModel의 'str' 속성에 값을 할당할 때마다 실행된다.
            console.log('할당', newValue);

            div.innerHTML = newValue; // 새로운 값이 들어올 때마다 화면이 바뀐다.
        }
    });
    ```

- 할당
    ```
    (입력) viewModel.str   
    (출력) 접근          
    ```

- 접근
    ```
    (입력) viewModel.str = 10  
    (출력) 할당 10
    ```
    또한, 화면도 바로 바뀌는 것을 확인할 수 있다.


- 따라서, set을 재정의함으로써, 새로운 값이 들어올 때마다 화면이 바뀌도록 할 수 있다.
- 이것이 Vue의 핵심인 **Reactivity**이며, 데이터의 변화를 라이브러리에서 감지하여 알아서 화면을 그려준다. (**Data Binding**)

### Reactivity 코드 라이브러리화 하기
```js
(function() { // 즉시 실행 함수
    function init() {
        Object.defineProperty(viewModel, 'str', { 
            get: function() { 
            },
            set: function(newValue) {
                render(newValue);
            }
        })
    }
    
    function render(value) {
        div.innerHTML = value;
    }

    init();
})();
```

- [즉시 실행 함수](https://developer.mozilla.org/ko/docs/Glossary/IIFE)의 역할
  - 애플리케이션 로직에 노출되지 않도록 내부의 실행되는 코드를 또 다른 Scope(유효범위)에 넣어준다.
  - 변수의 유효범위를 관리한다.

### Hello Vue.js와 뷰 개발자 도구
- `index.html`
    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Getting Started</title>
    </head>
    <body>
        <div id="app">
        {{ message }}
        </div>

        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <script>
        new Vue({
            el: '#app',
            data: {
            message: 'Hello Vue.js'
            }
        })
        </script>
    </body>
    </html>
    ```

- 실행화면

    ![hello-world](/assets/images/post/20210426/hello-world.png)

- 뷰 개발자 도구 화면

    ![vue-devtools](/assets/images/post/20210426/vue-devtools.png)

- `<Root>` 클릭

    ![hello-world-tool](/assets/images/post/20210426/hello-world-tool.png)

- `message` 를 수정하면 바로 화면에 반영된다.

    ![hello-vuejs-tool](/assets/images/post/20210426/hello-vuejs-tool.png)

    ![hello-vuejs](/assets/images/post/20210426/hello-vuejs.png)

- Vue의 모든 data 속성에 reactivity가 반영되어 있다.
- 따라서, 데이터의 변화에 따라 화면이 자동으로 그려지게 된다.

## Reference
- <https://www.inflearn.com/course/Age-of-Vuejs/>