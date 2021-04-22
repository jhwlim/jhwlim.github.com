---
title: "[Spring Security] 로그인 구현하기 ① 초기 설정과 튜토리얼"
excerpt: ""
categories: spring
tags: spring-security spring-legacy spring-mvc
---
## Introduction
Spring MVC Project에서 Spring Security를 적용하여 로그인 기능을 구현해보면서 작성했던 예제와 공부했던 내용을 정리하려고 한다.

**개발 환경**
  - Java 8
  - Spring 5.2.12 RELEASE

## Maven Dependency
Spring 5.2.12 RELEASE를 사용하고 있기 때문에 Spring Security는 5.2.x RELEASE를 선택한다.

```xml
<properties>
    <!-- ... -->
    <spring-security.version>5.2.10.RELEASE</spring-security.version>
</properties>
```

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-core</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${spring-security.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${spring-security.version}</version>
</dependency>
```

## Spring Security 설정하기
### 1. SecurityConfig 클래스 생성
`WebSecurityConfigurerAdapter` 클래스를 상속받고, `@Configuration`과 `@EnableWebSecurity` 어노테이션을 추가한다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// ...
	}

	@Bean
	@Override
	public UserDetailsService userDetailsService() {
		// ...
	}
}
```

<br>
사용자의 권한에 따른 자원의 접근 정책을 설정한다.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
	http.csrf().disable();				// [1]

	http.authorizeRequests()			// [2]
		.antMatchers("/").permitAll()		// [3]
		.anyRequest().authenticated();		// [4]
			
	http.formLogin()				// [5]
		.loginPage("/login").permitAll();	// [6]
			
	http.logout().permitAll();			// [7]
}
```

- [1] csrf 설정을 비활성화한다. (Spring Security는 기본적으로 csrf 공격을 방지하는 기능이 활성화되어 있다.)
- [2] 요청에 대한 권한을 지정한다.
- [3] "`/`" 요청은 모든 사용자가 접근할 수 있다.
- [4] 그 외의 모든 요청은 인증된 사용자만 접근할 수 있다.
- [5] 로그인 페이지를 설정한다.
- [6] 로그인 요청 경로를 "`/login`" 으로 설정하고, 모든 사용자가 접근할 수 있다.
- [7] 로그아웃은 모든 사용자가 접근할 수 있다.

<br>
테스트를 위해 임시로 사용자의 정보를 메모리에 추가하기 위하여 `@Bean` 어노테이션을 이용하여 `UserDetailsService` 인터페이스를 Bean으로 등록한다. 로그인 요청이 오면 내부의 `loadUserByUsername()` 메서드를 통해 유저의 정보를 확인한다.

```java
@Bean
@Override
public UserDetailsService userDetailsService() {
	UserDetails user = User.withDefaultPasswordEncoder()
				.username("user")	// [1]
				.password("password")	// [2]
				.roles("USER")		// [3]
				.build();
	return new InMemoryUserDetailsManager(user);
}
```

- [1] 사용자의 이름을 "`user`"로 설정한다.
- [2] 사용자의 패스워드를 "`password`"로 설정한다.
- [3] 사용자의 역할(권한)을 "USER"로 설정한다.
<br>

### 2. SecurityWebAppInitializer 클래스 생성
`AbstractSecurityWebApplicationInitializer` 클래스를 상속받는다. 클래스 내부에 추가로 작성할 내용은 없지만 Spring Security를 적용하기 위해서는 반드시 생성해야 한다. (Spring Security가 제공하는 필터들을 사용할 수 있도록 활성화해준다.)

```java
public class SecurityWebAppInitializer extends AbstractSecurityWebApplicationInitializer {
    // Don't need to do anything
}
```

## Controller

```java
@Controller
public class HomeController {

	@GetMapping("/")
	public String home() {
		return "home";
	}
	
	@GetMapping("/hello")
	public void hello() {}
	
	@GetMapping("/login")
	public void login() {}
	
}
```

## View

### home.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<title>Welcome Home!</title>
</head>
<body>
<h1>Welcome!</h1>
<p>Click! <a href="<c:url value='/hello'/>">here</a> to see a greeting.</p>
</body>
</html>
```

### hello.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Hello World!</title>
</head>
<body>
<h1>Hello!</h1>
<form action="<c:url value='logout'/>" method="POST">
	<input type="submit" value="Sign Out" />
</form>
</body>
</html>
```

### login.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Login</title>
</head>
<body>
<form action="<c:url value='/login'/>" method="POST">
    <div><label> User Name : <input type="text" name="username"/> </label></div>
    <div><label> Password: <input type="password" name="password"/> </label></div>
    <div><input type="submit" value="Sign In"/></div>
</form>
<c:if test="${param.error != null}">
	<p>Invalid username and password.</p>
</c:if>
<c:if test="${param.logout != null}">
	<p>You have been logged out.</p>
</c:if>
</body>
</html>
```

## Result
### Project Structure
최종 프로젝트 구조는 아래와 같다. 👉 [Github Link](https://github.com/jhwlim/my-spring-legacy-study/tree/74258a21bebe990e41a660eceedbb822af547466/spring-security)

```
src/main/java
	└ com.spring.demo
		├ config.security
		│	├ SecurityConfig.class
		│	┗ SecurityWebAppInitializer.class
		└ HomeController.class

src/main/webapp
	└ WEB-INF
		┗ spring
		│	├ appServlet
		│	│	└ servlet-context.xml
		│	└ root-context.xml
		├ views
		│	├ hello.jsp
		│	├ home.jsp
		│	└ login.jsp
		└ web.xml
```

<br>

### Output
"`/`"로 접속하면 아래와 같은 화면이 나타난다. 모든 사용자에게 접근이 허락되는 요청이기 때문에 정상적으로 페이지에 접근할 수 있다.

![home](/assets/images/post/20210422/home.png)

<br>
`here`을 클릭하면 "`/hello`"로 접근한다. 하지만 "`/hello`"로 접근하기 위해서는 권한이 필요하며 로그인이 되어 있지 않다면 "`/login`"으로 리다이렉트되어 로그인 페이지가 나타난다.

![login](/assets/images/post/20210422/login.png)

User Name을 `user`, Password를 `password`로 입력하면 정상적으로 로그인이 되어 "`/hello`"로 접근할 수 있다.

![hello](/assets/images/post/20210422/hello.png)

<br>
`Sign up` 버튼을 누르면 "`/logout`"으로 로그아웃 요청이 발생하고, 로그아웃 처리 후 "`/login?logout`"으로 리다이렉트되어 로그인 페이지가 나타난다.

![logout](/assets/images/post/20210422/logout.png)

<br>
로그인페이지에서 사용자의 정보를 잘못 입력하였을 경우, "`/login?error`"로 리다이렉트되고 아래와 같이 화면이 나타난다.

![login fail](/assets/images/post/20210422/login_fail.png)


## Conclusion
Spring Security에 대한 초기 설정과 기본 예제를 구현해보았다. 

다음에는 데이터베이스에서 사용자 정보를 조회하여 로그인을 처리하도록 만들어볼 예정이다.

## Reference
- <https://spring.io/guides/gs/securing-web/>
- <https://bamdule.tistory.com/53>