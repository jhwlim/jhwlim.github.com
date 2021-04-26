---
title: "[Spring Security] 로그인 구현하기 ② 데이터베이스 연동하기"
excerpt: ""
categories: spring
tags: spring-security spring-legacy spring-mvc
---
## Introduction
[이전 포스팅](/spring/spring-security-basic-login-1)에 이어서 데이터베이스에서 사용자 정보를 조회하여 로그인을 처리하도록 만들어보려고 한다.

**개발 환경**
  - Java 8
  - Spring 5.2.12 RELEASE
  - MySQL
  - Mybatis

## Maven Dependency
DB 연동을 위하여 관련 Dependency를 추가한다. (Spring Security 관련 Dependency는 [이전 포스팅](/spring/spring-security-basic-login-1/#maven-dependency) 참고)

```xml
<!-- DB -->
<!-- MySQL -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>8.0.21</version>
</dependency>
<!-- HikariCP -->
<dependency>
	<groupId>com.zaxxer</groupId>
	<artifactId>HikariCP</artifactId>
	<version>3.4.5</version>
</dependency>
<!-- Mybatis -->
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.4.6</version>
</dependency>
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis-spring</artifactId>
	<version>1.3.3</version>
</dependency>
<!-- Spring-jdbc -->
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-jdbc</artifactId>
	<version>${org.springframework-version}</version>
</dependency>
```

## MySQL / Mybatis 설정하기
### 1. dataSource.properties 파일 생성
```
driverClassName=com.mysql.cj.jdbc.Driver
jdbcUrl=jdbc:mysql://localhost:3306/{user-schema}?serverTimezone=Asia/Seoul
username={username}
password={password}
```

MySQL의 Schema는 `study`이고, 아이디와 비밀번호는 각각 `study`, `study` 이므로, 아래와 같이 properties 파일을 생성한다. 

```
driverClassName=com.mysql.cj.jdbc.Driver
jdbcUrl=jdbc:mysql://localhost:3306/study?serverTimezone=Asia/Seoul
username=study
password=study
```

### 2. DatabaseConfig 클래스 생성
```java
@Configuration
@MapperScan("com.spring.demo.domain.**.mapper")  // [1]
public class DatabaseConfig {
	
	@Bean
	public HikariConfig hikariConfig() {
		return new HikariConfig("/config/dataSource.properties");  // [2]
	}
	
	@Bean
	public HikariDataSource dataSource() {
		return new HikariDataSource(hikariConfig());  // [3]
	}
	
	@Bean
	public SqlSessionFactoryBean sqlSessionFactory() {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(dataSource());  // [4]
		return sqlSessionFactoryBean;
	}
}
```

- [1] : 해당 패키지 경로 아래의 Mapper 인터페이스를 자동 스캔하도록 설정한다.
- [2] : DatabaseConfig 클래스에서 이 파일을 `hikariConfig()`에서 읽고 HikariConfig 객체를 생성하여 Bean으로 등록한다.
- [3] : [2]에서 생성한 Bean을 주입한다.
- [4] : [3]에서 생성한 Bean을 주입한다.

## DB Schema
```sql
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,	-- 사용자 고유번호 (PK)
    username VARCHAR(30) NOT NULL,		-- 사용자 이름
    password VARCHAR(255) NOT NULL,		-- 사용자 비밀번호
    enabled BOOLEAN NOT NULL,			-- 사용가능 여부
    PRIMARY KEY (id),
    UNIQUE KEY (username)
);

CREATE TABLE user_authorities (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,	-- 사용자 권한 고유번호 (PK)
    user_id INT UNSIGNED NOT NULL,		-- 사용자 이름 (FK)
    authority VARCHAR(50) NOT NULL,		-- 권한 이름
    PRIMARY KEY (id),
    UNIQUE KEY (user_id, authority),
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Spring Security 설정하기
### 1. SecurityConfig 클래스 수정
DB에서 사용자의 정보를 조회할 수 있도록 Spring Security 설정을 수정한다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private DataSource dataSource;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		// ...
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// 이전과 동일
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
```

DB에서 사용자의 이름, 비밀번호, 권한을 조회하여 로그인 요청을 처리한다.
```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	auth.jdbcAuthentication()
		.dataSource(dataSource)			// [1]
		.passwordEncoder(passwordEncoder())	// [2]
		.usersByUsernameQuery(			// [3]
				"SELECT username, password, enabled FROM users WHERE username = ?")
		.authoritiesByUsernameQuery(		// [4]
				"SELECT u.username, a.authority " +
				"FROM user_authorities a, users u " +
				"WHERE u.username = ? AND u.id = a.user_id"
				);
}
```
- [1] : `@Autowired`한 `dataSource`를 주입한다.
- [2] : `@Bean`으로 생성한 PasswordEncoder Bean을 주입한다.
- [3] : 사용자의 이름(username)과 비밀번호(password), enabled를 포함한 사용자의 정보를 조회한다. 
- [4] : 사용자의 이름(username)과 사용자의 권한을 조회한다.

## Test 준비
테스트를 위해 사용자 테이블에 데이터를 추가한다. 그런데 Spring Security는 PasswordEncoder를 적용하고 있기 때문에 사용자와 사용자 권한을 등록할 수 있도록 Mapper와 jUnit 테스트 클래스를 작성하였다.

### 1. Model 클래스
```java
@Getter
@ToString
public class User {
	
	private int id;
	private String username;
	private String password;
	private boolean enabled;
	
	@Builder
	public User(String username, String password, boolean enabled) {
		this.username = username;
		this.password = password;
		this.enabled = enabled;
	}
}
```

```java
@Getter
@ToString
public class UserAuthority {
	
	private int id;
	private int userId;
	private String authority;
	
	@Builder
	public UserAuthority(int userId, String authority) {
		this.userId = userId;
		this.authority = authority;
	}
}
```

### 2. Mapper 인터페이스와 xml
```java
public interface UserSignupMapper {
	
	public void insertUser(User user);				// [1]
	
	public void insertUserAuthority(UserAuthority userAuthority);	// [2]

}
```
- [1] : 사용자 등록
- [2] : 사용자 권한 등록

`insertUser()` 를 실행하면 `users` 테이블에서 `AUTO_INCREMENT`에 의해서 생성된 `id` 값이 `User` 객체에 저장된다.
```xml
<insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
	INSERT INTO users (
		username, password, enabled
	) VALUES (
		#{username}, #{password}, #{enabled}
	)
</insert>

<insert id="insertUserAuthority">
	INSERT INTO user_authorities (
		user_id, authority
	) VALUES (
		#{userId}, #{authority}
	)
</insert>
```

### 3. Test 클래스
아래와 같이 테스트 클래스를 작성하고 jUnit Test를 실행하여 사용자와 사용자의 권한 정보를 등록한다.

```java
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",	
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class UserSignupMapperTest {
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	UserSignupMapper mapper;
	
	@Test
	public void createUser() {
		User user = User.builder()
				.username("test01")				// [1]
				.password(passwordEncoder.encode("test01"))	// [2]
				.enabled(Boolean.TRUE)				// [3]
				.build();
		
		mapper.insertUser(user);	// [4]
		
		UserAuthority userAuthority = UserAuthority.builder()
								.userId(user.getId())	// [5]
								.authority("USER")	// [6]
								.build();
		
		mapper.insertUserAuthority(userAuthority);	// [7]
	}
	
}
```
- [1] : 사용자 이름
- [2] : 비밀번호
- [3] : 테스트를 위해 TRUE 설정한다.
- [4] : DB에 사용자를 등록한다.
- [5] : [4]에서 생성된 `users` 테이블의 `id` 값을 넣어준다.
- [6] : 권한 이름을 설정한다.
- [7] : DB에 사용자 권한을 등록한다.

#### ※ 참고사항
[6]에서 권한 이름을 `USER`로 설정하였을 때, SecurityConfig 에서 `hasAuthority(USER)`로 자원의 접근을 `USER`로 제한할 수 있다. 하지만 `hasRole()`으로 자원의 접근을 제한할 수 없다. `hasRole()`은 권한을 나타내는 문자열 앞의 `ROLE_`을 제거한 것을 의미하기 때문이다. 즉, 권한 이름이 `ROLE_USER` 라면, `hasAuthority(ROLE_USER)` 또는 `hasRole(USER)`로 자원의 접근을 제한할 수 있다. 따라서 <u>DB에 권한을 저장할 때는 "ROLE_" 을 붙여서 저장하는 것이 좋을 것 같다.</u>

## Result
### 1. Project Structure
최종 프로젝트 구조는 아래와 같다. 👉 [Github Link](https://github.com/jhwlim/my-spring-legacy-study/tree/0a6112b8591dbb9db693c4484b3111759faa0d27)

```
src/main/java
	└ com.spring.demo
		├ domain.user
		│	├ dto
		│	│	├ User.java
		│	│	└ UserAuthority.java
		│	├ mapper
		│	│	└ UserSignupMapper.java
		│	└ HomeController.java
		└ global.config.
			├ security
			│	├ SecurityConfig.java
			│	┗ SecurityWebAppInitializer.java
			└ DatabaseConfig.java

src/main/resources
	├ com/spring/demo/domain/user/mapper
	│	└ UserSignupMapper.xml
	└ config
		└ dataSource.properties

src/test/java
	└ com.spring.demo.domain.user.mapper
		└ UserSignupMapperTest.java

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

### 2. Output
DB에 사용자와 권한을 등록하고 서버를 실행하여 테스트를 진행하면 DB에 등록된 사용자와 사용자의 권한을 조회하여 로그인이 처리되는 것을 확인할 수 있다.

## Conclusion
데이터베이스에서 사용자의 정보를 조회하여 로그인이 처리하는 것을 직접 만들어보았다. 테스트를 위해서 Model과 Mapper, Test 클래스를 작성한 것을 제외하면, 실제로는 DB 연동을 위한 설정을 추가하고, Spring SecurityConfig 클래스 파일을 약간 수정하는 것으로 데이터베이스에서 사용자의 정보를 조회해서 로그인 처리를 할 수 있었다.

이어서 로그인한 사용자의 정보에 접근하는 방법과 이와 관련하여 커스터마이징 하는 방법에 대해서 정리할 예정이다.

## Reference
<https://grobmeier.solutions/spring-security-5-using-jdbc.html>