- 인텔리제이 설치하기 - 커뮤니티 버전

<https://start.spring.io/>
  
Maven vs Gradle
- Gradle 선택

- Group : 보통 기업 도메인명을 작성한다.
- artifact : 빌드했을 때 나오는 결과물, 일종의 프로젝트명

dependencies 추가
- spring web
- thymeleaf

gradle : 버전 설정하고 라이브러리를 가져와주는 도구로 이해하자.

build.gradle
```
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation('org.springframework.boot:spring-boot-starter-test') {
		exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
	}
}
```

- thymeleaf : html을 만드는 템플릿 엔진
- spring web 
- testImplementation : 기본적으로 추가되는 테스트 라이브러리 (jUnit5)

```
repositories {
	mavenCentral()
}
```

- 라이브러리를 다운로드 받는 사이트로 보면 된다.

---

hello.hellospring.HelloSpringApplication 클래스

프로젝트 생성 및 기본 환경 설정 완료
--------

### 라이브러리 살펴보기
- 각 라이브러리는 의존관계가 설정되어 있으며, gradle은 의존관계가 설정되어 있는 라이브러리도 다 가져온다. 그래서 External Libraries를 확인하면 설정하지 않은 라이브러리도 추가되어 있는 것을 확인할 수 있다.

boot-starter-tomcat

스프링 부트는 내장된 톰캣을 사용한다. 

spring-boot-starter-loggin

logback과 slf4j를 많이 사용한다.

---

static/index.html

HelloController

hello.html