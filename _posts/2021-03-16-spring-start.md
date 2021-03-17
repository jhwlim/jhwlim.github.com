---
title: "Spring MVC 프로젝트 생성 및 초기설정"
excerpt: ""
categories: spring
tags: spring spring-mvc setting pom.xml
---
## 1. Spring MVC 프로젝트 생성하기

1. Eclipse 상단의 `[File]-[New]-[Spring Legacy Project]`를 클릭

- 프로젝트 이름을 작성하고, `Spring MVC Project`를 선택한 뒤 `Next`

<img src="/assets/images/_posts/2021-03-16/004_20210316.png" alt="프로젝트 생성 1번 이미지" width="80%">

- 프로젝트 패키지 경로를 작성한 뒤, `Finish` 
  (이때, 패키지 경로는 3단계로, 도메인주소를 거꾸로 작성한다.)

<img src="/assets/images/_posts/2021-03-16/003_20210316.png" alt="프로젝트 생성 2번 이미지" width="80%">


## 2. 프로젝트 구조

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

## 3. pom.xml 초기설정하기
1. java-version과 spring 버전 설정

    ```xml
    <properties>
        <java-version>1.8</java-version>
        <org.springframework-version>5.2.12.RELEASE</org.springframework-version>
        ...
    </properties>
    ```

2. configuration의 java-version 설정

    ```xml
    <build>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>2.5.1</version>
            <configuration>
                <source>${java-version}</source>
                <target>${java-version}</target>
                ...
            </configuration>
        </plugin>
    </build>
    ```

3. servlet 최신 버전으로 설정

    ```xml
    <!-- Servlet -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>javax.servlet.jsp-api</artifactId>
        <version>2.2.1</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
    ```