---
title: "[Spring Security] 로그인 구현하기 ③ 로그인 정보 접근 및 커스터마이징"
excerpt: ""
categories: spring
tags: spring-security spring-legacy spring-mvc
---
## Introduction
[이전 포스팅](/spring/spring-security-basic-login-2)에 이어서 로그인한 사용자의 정보에 접근하는 방법과, 로그인할 때 
DB에서 사용자의 다른 정보들도 함께 조회하여 저장하기 위한 방법에 대해 정리하려고 한다.

**개발 환경**
  - Java 8
  - Spring 5.2.12 RELEASE
  - MySQL
  - Mybatis

## 로그인 정보 접근하기
Spring Security에서 로그인 인증을 완료하면 로그인한 사용자의 이름, 비밀번호, 권한, 권한 등을 `org.springframework.security.core.userdetails.UserDetails`에 저장한다. 따라서 로그인 인증 후 생성된 `UserDetails` 객체에 접근하여 로그인한 사용자의 정보에 접근할 수 있다.

### 1. `Principal`
```java
@GetMapping("/hello")
public void hello(Principal principal) {
  if (principal != null) {
    log.info("username=" + principal.getName());
  }

  // ...
}
```

- 로그인한 사용자가 없다면 `null` 이다. (`NullPointerException` 주의)
- `getName()`을 통해 로그인한 사용자의 이름에 접근할 수 있다.
- 하지만 이 방법을 이용해서 `UserDetails` 객체에 접근할 수 없기 때문에 단순하게 로그인한 사용자의 이름만 필요한 경우 사용하면 좋을 것 같다.

### 2. `SecurityContextHolder`
```java
@GetMapping("/hello")
public void hello() {
  SecurityContext context = SecurityContextHolder.getContext();
  Authentication authentication = context.getAuthentication();
  
  Object principal = authentication.getPrincipal();
  if (principal instanceof UserDetails) {
    UserDetails user = (UserDetails) principal;
    log.info("username=" + user.getUsername());	
    log.info("password=" + user.getPassword());	
    log.info("authorities=" + user.getAuthorities());	
  }

  // ...
}
```

- `SecurityContextHolder`에서부터 순차적으로 `Authentication` 객체에 접근한다.
- 로그인한 사용자가 없더라도 `Authentication` 객체는 `null`이 아니다. (이때, `getPrincipal()`의 값은 `anonymousUser`이다.)
- 로그인하였다면, `UserDetails` 타입으로 클래스 캐스팅하여 정보에 접근할 수 있다. 
- 1번 방법에서 사용한 `Principal`과는 서로 관련이 없기 때문에 `Principal` 타입으로 클래스 캐스팅하여 사용할 수 없다.

### 3. `Authentication`
```java
@GetMapping("/hello")
public void hello(Authentication authentication) {
  if (authentication != null) {
    UserDetails user = (UserDetails) authentication.getPrincipal();
    log.info("username=" + user.getUsername());	
    log.info("password=" + user.getPassword());	
    log.info("authorities=" + user.getAuthorities());
  }

  // ...
}
```

- 로그인한 사용자가 없다면 `Authentication` 객체는 `null` 이기 때문에 사용시 `null` 체크가 필요하다.
- 이외의 `UserDetail` 타입으로 클래스 캐스팅하여 정보에 접근하는 것은 2번 방법과 동일하다.

### 4. `@AuthenticationPrincipal`
```java
@GetMapping("/")
public void hello(@AuthenticationPrincipal UserDetails user) {
  if (user != null) {
    log.info("username=" + user.getUsername());	
    log.info("password=" + user.getPassword());	
    log.info("authorities=" + user.getAuthorities());
  }
  
  // ...
}
```

- 로그인한 사용자가 없다면 `UserDetails` 객체는 null 이다. (`NullPointerException` 주의)

#### ※ 만약 `NoSuchMethodException`이 발생한다면 
`AuthenticationPrincipalArgumentResolver`가 Bean으로 등록이 안되어있어서 발생하는 문제이다.

스프링 공식 문서에 따르면 `@EnableWebSecurity` 어노테이션을 이용하여 자바 기반으로 설정을 하면 자동적으로 등록해준다고 하며, xml 기반의 설정이라면 xml에 아래의 내용을 추가해야 한다고 한다. (나는 스프링 시큐리티는 `@EnableWebSecurity`를 이용하여 설정을 했지만 기본 프로젝트 설정이 xml을 사용하고 있기 때문에 추가로 등록을 해줘야 했던 것 같다.)

servlet-context.xml에 아래의 내용을 추가한다.
```xml
<annotation-driven>
  <argument-resolvers>
    <beans:bean class="org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver"/>
  </argument-resolvers>
</annotation-driven>
```

또는 자바 기반으로 직접 리졸버를 추가할 수도 있다. 이때, servlet-context.xml 아래에 `<annotation-driven />`이 있으면 안된다.

```java
@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
	
  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    argumentResolvers.add(authenticationPrincipalArgumentResolver());
  }

  @Bean
  public AuthenticationPrincipalArgumentResolver authenticationPrincipalArgumentResolver() {
    return new AuthenticationPrincipalArgumentResolver();
  }
}
```

## `UserDetails`와 `UserDetailsService` 커스터마이징
로그인 인증시 사용자의 이름, 비밀번호, 권한만 로그인 정보로 저장한다면 그 이외의 정보(사용자 고유번호 등)을 확인하기 위해 다시 DB에서 조회해야하는 불편한 상황이 생길 수 있다.

이러한 상황을 해결하기 위해서 UserDetails와 UserDetailsService를 커스터마이징 함으로써 로그인 인증시 저장할 정보를 지정할 수 있다.

### 1. `UserDetails` 인터페이스와 `User` 클래스
`UserDetails`는 인터페이스로 직접 클래스를 구현하여 사용할 수 있다. 하지만 `org.springframework.security.core.userdetails.User` 클래스를 상속 받아서 좀 더 간단하게 구현할 수 있다. `User` 클래스는 `UserDetails` 인터페이스를 구현한 클래스이기 때문에 `User` 클래스를 상속 받아서 `UserDetails`로 사용할 수 있다. (다형성)

우선 기존에 사용하였던 `User` 클래스의 이름을 헷갈리지 않게 `Account` 클래스 이름으로 변경하였다. 그리고 권한에 대한 field로 `authority`를 추가해주었다.
```java
@Getter
@ToString
public class Account {
	
  private int id;
  private String username;
  private String password;
  private boolean enabled;

  private String authority; 

  public Account() {}

  @Builder
  public Account(String username, String password, boolean enabled) {
    this.username = username;
    this.password = password;
    this.enabled = enabled;
  }
	
}
```

그리고 `org.springframework.security.core.userdetails.User` 클래스를 상속받는 클래스를 생성하고, 사용자의 정보를 담을 수 있도록 field로 `account`를 추가하였다.
```java
@Getter
@ToString
public class SecurityUser extends User {

	private Account account;
	
	public SecurityUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
	}

	public SecurityUser(Account user) {
		super(user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority(user.getAuthority())));
		this.account = user;
	}
	
}
```

### 2. `UserDetailsService` 인터페이스
`UserDetailsService`는 인터페이스로 Spring Security는 해당 인터페이스의 `loadUserByUsername()` 메서드를 호출해서 리턴값으로 `UserDetails` 객체를 받아서 사용자가 브라우저에서 입력한 이름과 비밀번호를 비교하여 로그인을 처리한다. 따라서, 커스터마이징을 하기 위해서는 `UserDetailsService` 역시 직접 구현해야 한다.
```java
@Service
public class SecurityUserDetailsService implements UserDetailsService {
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // ...
  }
}
```

이때, DB에서 사용자의 정보를 조회해야 하기 때문에 Mapper를 작성하였다.
```java
public interface UserFindMapper {
	
  public Account selectUserWithAuthorityByUsername(String username);
	
}
```

```xml
<select id="selectUserWithAuthorityByUsername" resultType="com.spring.demo.domain.user.dto.Account">
  SELECT
    *
  FROM
    users u
      INNER JOIN user_authorities a
      ON u.id = a.user_id
  WHERE
    u.username = #{username}	
</select>
```

그리고 작성한 Mapper를 이용하여 DB에서 사용자의 정보를 조회하고, 조회한 정보를 바탕으로 위에서 생성한 `User`를 상속 받은 클래스 `SecurityUser`를 생성하여 리턴한다.
```java
@Autowired
private UserFindMapper mapper;

@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
  Account user = mapper.selectUserWithAuthorityByUsername(username);  // [1]
  if (user == null) {
    throw new UsernameNotFoundException("Could not found user '" + username + "'"); // [2]
  }
  
  return new SecurityUser(user);  // [3]
}
```
- [1] : 사용자 정보를 조회하여 `Account` 객체에 담는다.
- [2] : DB에 해당 사용자 이름의 정보가 없다면 `UsernameNotFoundException`을 발생시킨다.
- [3] : `Account` 객체를 이용하여 `User` 클래스를 상속받은 `SecurityUser` 클래스를 생성한다. `SecurityUser` 클래스는 `Account` 객체를 전달 받아 객체를 생성할 수 있도록 생성자를 추가했었다.

### 3. `SecurityConfig` 설정 수정하기
위에서 생성한 인터페이스를 이용하여 로그인 처리를 할 수 있도록 설정을 수정한다.
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
  @Autowired
  private UserDetailsService userDetailsService;

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // 이전과 동일
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
	
```

### 4. 로그인한 사용자 정보 확인하기
`UserDetails` 인터페이스가 아니라 위에서 생성한 `SecurityUser` 클래스를 이용하여 로그인한 사용자의 정보를 받게 되면, 아래와 같이 해당 클래스 내부에 추가한 `Account` 객체에 접근할 수 있다.
```java
@GetMapping("/hello")
public void hello(@AuthenticationPrincipal SecurityUser user) {
  if (user != null) {
    log.info("user=" + user.getAccount());
  }
}
```

위의 과정을 거치지 않고 다이렉트로 `SecurityUser` 내부의 `Account` 객체에 접근할 수도 있다.
```java
public void hello(@AuthenticationPrincipal(expression = "account") Account user) {
```
하지만 이 방식은 로그인한 상태에서만 사용이 가능하며, 로그인하지 않았다면 에러가 발생한다. 

그래서 실제로는 로그인하지 않았다면 `null`로 처리될 수 있도록 아래와 같이 사용자의 정보에 접근해야한다.
```java
public void hello(@AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : account") Account user) {
```

### 5. `@CurrentUser` 어노테이션 만들기
하지만 위의 방식으로 사용하기에는 너무 길어 사용하기에 불편하기 때문에 편리하게 사용할 수 있도록 어노테이션으로 만들 수 있다.

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : account")
public @interface CurrentUser {
}
```

`@CurrentUser` 어노테이션은 로그인하였다면 `SecurityUser` 내부의 `Account` 객체를 가리키게 되고, 로그인하지 않았다면 `null` 값을 갖게된다.
```java
public void hello(@CurrentUser Account user) {
```

## Result
### Final Project Structure
최종 프로젝트 구조는 아래와 같다. 👉 [Github Link](https://github.com/jhwlim/my-spring-legacy-study/tree/11b1a477911c8e821da7d981bbb767060059847a)

```
  src/main/java
  └ com.spring.demo
  ├ domain.user
  │ ├ dto
  │ │ ├ Account.java
  │ │ └ UserAuthority.java
  │ ├ mapper
  │ │ ├ UserFindMapper.java
  │ │ └ UserSignupMapper.java
  │ └ HomeController.java
  └ global.config
    ├ security
    │ ├ CurrentUser.java
    │ ├ SecurityUser.java
    │ ├ SecurityUserDetailsService.java
    │ ├ SecurityConfig.java
    │ ┗ SecurityWebAppInitializer.java
    ├ DatabaseConfig.java
    └ MvcConfig.java

  src/main/resources
  ├ com/spring/demo/domain/user/mapper
  │ ├ UserFindMapper.xml
  │ └ UserSignupMapper.xml
  └ config
    └ dataSource.properties

  src/test/java
  └ com.spring.demo.domain.user.mapper
    └ UserSignupMapperTest.java

  src/main/webapp
  └ WEB-INF
    ┗ spring
    │ ├ appServlet
    │ │ └ servlet-context.xml
    │ └ root-context.xml
    ├ views
    │ ├ hello.jsp
    │ ├ home.jsp
    │ └ login.jsp
    └ web.xml
```

## Conclusion
로그인한 사용자의 정보에 접근하는 방법과 커스터마이징하는 방법까지 정리해보았다. 직접 코드를 작성했던 내용을 순서대로 정리해보면서 Spring Security에서 로그인을 처리하는 과정에 대해서 대략적인 이해를 할 수 있었다. 작성했던 예제를 중심으로 정리를 하였기 때문에 시큐리티 세부 설정시 제공하는 다양한 메서드 등에 대한 정리가 미흡한데, 이 부분은 Spring Security의 이론적인 내용과 함께 다시 정리할 예정이다.

## Reference
<https://docs.spring.io/spring-security/site/docs/5.0.x/reference/html/mvc.html>