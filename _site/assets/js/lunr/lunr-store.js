var store = [{
        "title": "Spring MVC 프로젝트 생성 및 초기설정",
        "excerpt":"1. Spring MVC 프로젝트 생성하기 Eclipse 상단의 [File]-[New]-[Spring Legacy Project] 클릭 프로젝트 이름을 작성하고, Spring MVC Project 선택한 뒤 Next 프로젝트 패키지 경로를 작성한 뒤, Finish (이때, 패키지 경로는 3단계로, 도메인주소를 거꾸로 작성한다.) 2. 프로젝트 구조 SpringPractice : 프로젝트 이름 ├ src/main/java : 작성한 자바 파일들을 폴더 ├ src/main/resources :...","categories": ["spring"],
        "tags": ["spring","spring-mvc","setting","pom.xml"],
        "url": "https://jhwlim.github.io/spring/spring-start/",
        "teaser": null
      },{
        "title": "Spring WebSocket + STOMP를 이용한 실시간 채팅 구현하기",
        "excerpt":"Intro WebSocket은 웹 브라우저와 웹 서버 사이에 bi-directional, full-duplex, persistent connection 통신을 가능하게 하는 통신 프로토콜로, 한번 연결이 이루어지고 나면 연결이 끊어질 때까지 연결이 계속 유지된다는 특징을 가지고 있다. 이 때문에 WebSocket을 사용해서 실시간 채팅 기능을 구현할 수 있다. Spring에서는 아래의 2가지 방법으로 WebSocket을 사용할 수 있다. WebSocketHandler를 상속받아 세션...","categories": ["spring"],
        "tags": ["spring-websocket","websocket","STOMP"],
        "url": "https://jhwlim.github.io/spring/spring-websocket-tutorial-stomp-1/",
        "teaser": null
      },{
        "title": "Spring WebSocketHandler를 이용한 실시간 채팅 구현하기",
        "excerpt":"Intro 이전 포스트에서는 STOMP를 이용하여 간단한 실시간 채팅을 만들어보았다. 이번 포스팅에서는 WebSocketHandler를 이용하여 실시간 채팅을 만들어보려고 한다. 1. Maven Dependencies 웹소캣 사용을 위한 의존성 라이브러리 추가 &lt;dependency&gt; &lt;groupId&gt;org.springframework&lt;/groupId&gt; &lt;artifactId&gt;spring-websocket&lt;/artifactId&gt; &lt;version&gt;${org.springframework-version}&lt;/version&gt; &lt;!-- springframework-version 4.0 이상 --&gt; &lt;/dependency&gt; 메시지 데이터를 JSON으로 변환하기 위한 의존성 라이브러리 추가 &lt;dependency&gt; &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt; &lt;artifactId&gt;jackson-core&lt;/artifactId&gt; &lt;version&gt;2.10.2&lt;/version&gt; &lt;/dependency&gt; &lt;dependency&gt;...","categories": ["spring"],
        "tags": ["spring-websocket","websocket","WebSocketHandler"],
        "url": "https://jhwlim.github.io/spring/spring-websocket-tutorial-websockethandler/",
        "teaser": null
      },{
        "title": "[Spring] WebSocketHandler를 이용하여 일대일 채팅 구현하기",
        "excerpt":"Intro 이전 포스팅에 이어서 WebSocketHandler를 이용하여 일대일 채팅을 만들어보려고 한다. Requirement User1과 User2 사이의 메시지는 두 User에게만 전달되어야 한다. User는 하나의 브라우저에서 여러 개의 탭을 생성하여 채팅 페이지에 접근할 수 있고, 메시지를 보낼 수 있다. User1이 User2에게 메시지를 보내면 User1과 User2의 모든 채팅 페이지에서 동일한 응답을 해야한다. What is Problem?...","categories": ["spring"],
        "tags": ["spring-websocket","websocket","WebSocketHandler"],
        "url": "https://jhwlim.github.io/spring/spring-websocket-websockethandler-onetoone-chat/",
        "teaser": null
      },{
        "title": "[Spring Security] 로그인 구현하기 ① 초기 설정과 튜토리얼",
        "excerpt":"Introduction Spring MVC Project에서 Spring Security를 적용하여 로그인 기능을 구현해보면서 작성했던 예제와 공부했던 내용을 정리하려고 한다. 개발 환경 Java 8 Spring 5.2.12 RELEASE Maven Dependency Spring 5.2.12 RELEASE를 사용하고 있기 때문에 Spring Security는 5.2.x RELEASE를 선택한다. &lt;properties&gt; &lt;!-- ... --&gt; &lt;spring-security.version&gt;5.2.10.RELEASE&lt;/spring-security.version&gt; &lt;/properties&gt; &lt;dependency&gt; &lt;groupId&gt;org.springframework.security&lt;/groupId&gt; &lt;artifactId&gt;spring-security-core&lt;/artifactId&gt; &lt;version&gt;${spring-security.version}&lt;/version&gt; &lt;/dependency&gt; &lt;dependency&gt; &lt;groupId&gt;org.springframework.security&lt;/groupId&gt; &lt;artifactId&gt;spring-security-web&lt;/artifactId&gt;...","categories": ["spring"],
        "tags": ["spring-security","spring-legacy","spring-mvc"],
        "url": "https://jhwlim.github.io/spring/spring-security-basic-login-1/",
        "teaser": null
      },{
        "title": "[Vue.js] Vue.js 시작하기 ① 프로그램 설치 및 기본환경 설정",
        "excerpt":"Introduction Vue.js 시작하기 - Age of Vue.js 강의를 듣고 배운 내용을 정리한다. 프로그램 설치 Chrome Visual Studio Code node.js (LTS ver.) Vue.js devtools (크롬 확장 프로그램) Visual Studio Code 플러그인 설치 및 사용하기 1. 플러그인 설치 목록 Vetur Material Icon Theme Night Owl Live Server ESLint Prettier Auto Close Tag...","categories": ["vue"],
        "tags": ["frontend","vue.js"],
        "url": "https://jhwlim.github.io/vue/vue-lecture-start-1/",
        "teaser": null
      },{
        "title": "[Spring Security] 로그인 구현하기 ② 데이터베이스 연동하기",
        "excerpt":"Introduction 이전 포스팅에 이어서 데이터베이스에서 사용자 정보를 조회하여 로그인을 처리하도록 만들어보려고 한다. 개발 환경 Java 8 Spring 5.2.12 RELEASE MySQL Mybatis Maven Dependency DB 연동을 위하여 관련 Dependency를 추가한다. (Spring Security 관련 Dependency는 이전 포스팅 참고) &lt;!-- DB --&gt; &lt;!-- MySQL --&gt; &lt;dependency&gt; &lt;groupId&gt;mysql&lt;/groupId&gt; &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt; &lt;version&gt;8.0.21&lt;/version&gt; &lt;/dependency&gt; &lt;!-- HikariCP --&gt;...","categories": ["spring"],
        "tags": ["spring-security","spring-legacy","spring-mvc"],
        "url": "https://jhwlim.github.io/spring/spring-security-basic-login-2/",
        "teaser": null
      },{
        "title": "[Vue.js] Vue.js 시작하기 ② Reactivity",
        "excerpt":"Introduction Vue.js 시작하기 - Age of Vue.js 강의를 듣고 배운 내용을 정리하고자 한다. Vue.js 는 무엇인가? MVVM 패턴의 뷰 모델 (View Model) 레이어에 해당하는 화면 (View)단 라이브러리 View는 브라우저에서 사용자에게 보여지는 화면이다. 화면에 나타나는 요소(ex. 버튼, 입력박스 등)는 html이다. html은 DOM을 이용해서 자바스크립트로 조작할 수 있다. DOM Listener는 사용자의 이벤트를...","categories": ["vue"],
        "tags": ["frontend","vue.js"],
        "url": "https://jhwlim.github.io/vue/vue-lecture-start-2/",
        "teaser": null
      },{
        "title": "[Spring Security] 로그인 구현하기 ③ 로그인 정보 접근 및 커스터마이징",
        "excerpt":"Introduction 이전 포스팅에 이어서 로그인한 사용자의 정보에 접근하는 방법과, 로그인할 때 DB에서 사용자의 다른 정보들도 함께 조회하여 저장하기 위한 방법에 대해 정리하려고 한다. 개발 환경 Java 8 Spring 5.2.12 RELEASE MySQL Mybatis 로그인 정보 접근하기 Spring Security에서 로그인 인증을 완료하면 로그인한 사용자의 이름, 비밀번호, 권한, 권한 등을 org.springframework.security.core.userdetails.UserDetails에 저장한다. 따라서...","categories": ["spring"],
        "tags": ["spring-security","spring-legacy","spring-mvc"],
        "url": "https://jhwlim.github.io/spring/spring-security-basic-login-3/",
        "teaser": null
      },{
        "title": "[Vue.js] Vue.js 시작하기 ③ Vue 인스턴스와 컴포넌트",
        "excerpt":"Introduction Vue.js 시작하기 - Age of Vue.js 강의를 듣고 배운 내용을 정리하고자 한다. Vue CDN &lt;script src=\"https://cdn.jsdelivr.net/npm/vue/dist/vue.js\"&gt;&lt;/script&gt; Vue 인스턴스 1. 인스턴스 생성 var vm = new Vue(); 크롬 개발자 도구에서 인스턴스의 내용과 뷰에서 제공하는 속성을 확인할 수 있다. Example &lt;div id=\"app\"&gt;&lt;/div&gt; &lt;script src=\"https://cdn.jsdelivr.net/npm/vue/dist/vue.js\"&gt;&lt;/script&gt; &lt;script&gt; var vm = new Vue({ el:...","categories": ["vue"],
        "tags": ["frontend","vue.js"],
        "url": "https://jhwlim.github.io/vue/vue-lecture-start-3/",
        "teaser": null
      },{
        "title": "[Vue.js] Vue.js 시작하기 ④ 컴포넌트 통신",
        "excerpt":"Introduction Vue.js 시작하기 - Age of Vue.js 강의를 듣고 배운 내용을 정리하고자 한다. 컴포넌트 통신의 필요성 컴포넌트를 활용하여 영역별로 코드를 관리하면 컴포넌트간 관계가 생긴다. 뷰 컴포넌트는 각각 데이터를 관리하기 때문에 데이터 유효범위를 갖는다. 따라서 컴포넌트간 데이터를 공유하려면 props와 event를 이용해야한다. 상위 컴포넌트 → 하위 컴포넌트 : props를 전달하여 데이터를 내려준다....","categories": ["vue"],
        "tags": ["frontend","vue.js"],
        "url": "https://jhwlim.github.io/vue/vue-lecture-start-4/",
        "teaser": null
      },{
        "title": "[Vue.js] Vue.js 시작하기 ⑤ 라우터",
        "excerpt":"Introduction Vue.js 시작하기 - Age of Vue.js 강의를 듣고 배운 내용을 정리하고자 한다. 라우터 뷰에서 싱글 페이지 어플리케이션을 구현하거나 페이지 간의 이동 기능을 구현할 때 사용하는 라이브러리 1. CDN 순서도 중요하다. &lt;script src=\"https://cdn.jsdelivr.net/npm/vue/dist/vue.js\"&gt;&lt;/script&gt; &lt;script src=\"https://unpkg.com/vue-router/dist/vue-router.js\"&gt;&lt;/script&gt; 2. 라우터 인스턴스 생성 new VueRouter({ // ... }); 3. 뷰 인스턴스와 연결하기 new Vue({...","categories": ["vue"],
        "tags": ["frontend","vue.js"],
        "url": "https://jhwlim.github.io/vue/vue-lecture-start-5/",
        "teaser": null
      }]
