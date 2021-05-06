- authorizeRequest() : 요청 url에 따라 접근 권한을 설정하겠다.
- andMatchers() : 요청 url 패턴 지정
- permitAll() : 모든 유저에게 접근을 허용한다.
- anyRequest() : 모든 리소스를 의미
- authenticated() : 인증된 유저만 접근을 허용한다.
- formLogin() : form login 설정
- loginPage("{url-path}")
- logout() : 로그아웃 설정

### Login Config 구성하기


1. 초기 설정과 튜토리얼 - csrf 설정 추가?
2. 데이터베이스 연동하기 - 권한 등록시 주의사항
3. User와 UserDetailsService 구현하여 커스터마이징하기
4. 로그인한 사용자 정보 접근하기
5. (번외) 전체 Summary
6. (번외) 자동로그인 어떻게??