---
title: "Spring MVC 프로젝트 살펴보기"
excerpt: ""
categories: spring
# classes: wide
tags: spring spring-mvc context-path 
---
## 1. 들어가기 전에
Spring MVC 프로젝트를 생성하고, pom.xml 초기설정을 마친 후, 프로젝트가 실행되는 결과를 바탕으로 프로젝트가 동작되는 방식을 살펴보자.

## 2. 프로젝트 구조
프로젝트를 생성하면 아래와 같은 구조의 프로젝트가 생성된다. 이때, **`WEB-INF` 폴더 아래의 파일에는 보안 때문에 직접 접근할 수 없다.** `WEB-INF/views/home.jsp` 에서 `Ctrl` + `F11` 단축키를 통해 강제로 실행시켜도 404 에러가 발생한다.

```
SpringPractice              : 프로젝트 이름
├ src/main/java             : 작성한 자바 파일들을 폴더
├ src/main/resources        : 자바 파일을 실행할 때 필요한 파일들을 보관하는 폴더
├ src/test/java             : 작성한 자바 파일에 대한 테스트 코드를 작성한 파일들을 보관하는 폴더
├ src/main/resources        : 테스트 코드를 실행할 때 필요한 파일들을 보관하는 폴더
├ src                       : 작성한 웹 관련 파일들을 보관하는 폴더
    └ main/webapp/
        ├ resources         : css, js 등 정적 파일들을 보관하는 폴더
        └ WEB-INF
            ├ spring
                ├ appServlet/servlet-context.xml    : DispatcherServlet을 자바 코드 없이 다룰 수 있는 설정 파일
                └ root-context.xml                  : 프로젝트 전체의 설정 파일
            ├ views         : jsp 파일들을 보관하는 폴더
            └ web.xml       : Tomcat의 web.xml 파일 
├ target                    : 실제로 만들어질 프로젝트를 미리 볼 수 있는 폴더
└ pom.xml                   : Maven 설정파일
```