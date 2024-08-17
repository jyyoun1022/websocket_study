###  웹소켓 이란?
- 웹소켓은 서버와 클라이언트 사이에 소켓 커넥셔을 유지하면서, 양빵향 통신이 가능한 기술이다.

- 웹소켓은 HTTP로 Handshake를 초기 통신을 시작한 후, 웹소켓 프로토콜로 변환하여 데이터를 전송한다.

> Handshake 
> >클라이언트와 서버 간의 연결을 확립하는 초기 단계로, 웹소켓 프로토콜이 HTTP(S)를 통해 수행되는 일반적인 통신에서 전환되는 과정
> 
> 
![스크린샷 2024-08-10 오후 11.56.12.png](..%2F..%2F..%2F..%2Fvar%2Ffolders%2Fz8%2Fr54ycqj94k91dmc_mnc1kqs40000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_nOXPwj%2F%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202024-08-10%20%EC%98%A4%ED%9B%84%2011.56.12.png)

 * 먼저 클라이언트는 서버에 HTTP 프로토콜로 핸드쉐이크 요청을 한다
![스크린샷 2024-08-11 오전 12.12.53.png](..%2F..%2F..%2F..%2Fvar%2Ffolders%2Fz8%2Fr54ycqj94k91dmc_mnc1kqs40000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_LP11IK%2F%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202024-08-11%20%EC%98%A4%EC%A0%84%2012.12.53.png)

### 웹소켓을 위한 별도의 포트를 오픈해야 하는가?
- No, HTTP 또는 HTTPS 통신을 위해 오픈한 포트를 사용한다.
- 웹소켓은 HTTP 포트 80 와 HTTPS 443 위에서 동작되도록 설계가 되어있으므로 별도의 포트를 오픈할 필요가 없다.
- 호환을 위해 핸드쉐이크는 HTTP upgrade 헤더를 사용하여, HTTP 프로토콜에서 웹소켓 프로토콜로 변경한다.

### ws 와 wws의 차이점?
- 일반적으로 보안을 위해서 HTTP 통신이 아닌 HTTPS를 해야한다.
- 웹소켓 통신 역시 ws가 아닌 wws로 통신해야 시큐어 통신이 가능하다.

### 웹소켓 통신은 실시간 양방향 통신을 위해 사용한다.



# OAuth (Open Authorization)
- OAuth는 인증(Authenticatoin) 과 인가(Authorization)를 모두 포함하고 있지만,
그중 OAuth는 **인가**에 조금 더 초점을 맞추고 있다.
- 네이버나 카카오 로그인을 생각해보ㅕㄴ, 네이버,카카오 사용자인지 확인하는 과정은 네이버나 카카오가 담당한다.
- 하지만 주요 목적은 사용자에게 사용자의 이름이나, 이메일을 가져온다던지 하는 **권한**을 제공해주는 것이다.
- OAuth 2.0 부터는 반드시 HTTPS 사용, 웹이 아닌 애플리케이션도 지원, Access token 만료 시간 설정 등이 추가 되었다.

### 용어 정리 (OAuth2.0 기준)
- Resource Owner : 사용자, 사람이 될 수도 있고, Application 자체가 될 수도 있다.
- Client Application: 사용자가 사용하는 서비스 애플리케이션, 서버, 데스크톱 등 어떤 기기든 될 수 있다.
- Resource Server ; OAuth를 통해 인증, 인가를 제공해주는 서버. 자원 서버, 자원(이름, 이메일, 프로필 사진 등)을 제공해준다.(ex. github, naver, kakao, google)
- Authorization Server: OAuth를 통해 인증,인가를 제공해주는 서버,인증 서버. 토큰을 발급해준다.
 
### OAuth 2.0 인증 방식
> OAuth 2.0에는 4가지 인증 방식이 있다.
1. **Authorization Code Grant**
2. Implicit Grant
3. Resource Owner Password Credentials Grant
4. Client Credentials Grant
> 웹이나 앱에서는 **Authorization Code Grant** 방식이 가장 많이 사용한다.


### Authorization Code Grant
- OAuth 서버에서 client Application에게 바로 access token을 넘겨주는 것이 아니라, Authorization code를 넘겨주고, client Application은 Authorization code를 통해 access token을 발급 받아, access token으로 허가된 리소스 요청을 하는 방식이다.
- 이렇게 Authorization code를 도입하게 되면 access token 자체는 백엔드에서만 존재하게 되로, 중간에 access token을 탈취당하지 않게 된다.

<img width="794" alt="스크린샷 2024-08-17 오후 8 35 10" src="https://github.com/user-attachments/assets/a00144d3-cd6c-4e9b-8f4c-db97b5a01b8a">

### OAuth + JWT 예시
>새로운 웹 애플리케이션을 프로트, 백 나눠서 개발하려고한다.
> 자체 로그인을 구현하기보다 github을 통하여 로그인을 하려고한다.
> 이때 github 사용자의 이름, 이메일, 프로필 사진정보를 가져와서 회원으로 등록하려고 한다.

#### 인증 방식으로 토큰을 선택한 이유
- 세션 대신 토큰을 사용하려는 이유는 확장성 떄문이다. 만약 여러 서버가 돌아가는 상황이라면, 각 서버마다 세션 저장소를 두거나, 공통 세션 저장소를 만들어야하는데, 이 또한 비용이기 때문이다. 반면에 토큰은 stateless하기 때문에 확장에 용이하다.
- 다만, 토큰은 한 번 발급되면 강제로 만료시킬 수 없다는 단점이 있다. 따라서 만료 시간이 짧은 access token과 만료 시간이 긴 refresh token을 나눠서 사용하는 것이다.
- 토큰은 실제로 로그인을 유지하고 있는 것이 아니라 로그인이 유지된 것 처럼 행동한다.(클라이언트가 access token을 저장해두고, 요청 때마다 보내는 방식) 따라서 만약 access token이 만료된 것이 아니라면, 로그아웃을 했더라도 해당 access token만 가지고 있다면, 로그인 된 상태처럼 행동할 수 있다고 한다.

#### 프론트엔드 역할
- github OAuth 서버로 github 로그인 요청 후, Authorization code를 발급 받아, 백엔드에 전달
- 백엔드에서 응답 받은 access token, refresh token 저장해두기
- 권한이 필요한 요청마다 Authorization Header 에 access token 같이 보내주기
- access token이 만료되었다면, refresh token을 보내서 갱신하기 (프론트에서 요청 날릴 때 access token이 만료됨을 미리 판별하여 갱신 요청을 보낼 수 있음)
- refresh token 만료 기간이 7일 이내면, refresh token 재발급 요청

#### 백엔드 역할
- Authorization code로 github OAuth 서버에 토큰 요청
- (로그인 할 때 이외에 OAuth 서버와 통신이 필요한 경우 발급 받은 토큰 저장해야함)
- Access token으로 이름, 이메일, 프로필 URL 정보 요청
- db에 존재하지 않는 유저라면, 새로 등록. db에 존재하는 유저라면 정보 업데이트
- 유저의 primary key 값으로 JWT 토큰 (accesss & refresh token)생성. 일반적으로 accesss token은 한시간, refresh token은 2주로 ㅅ ㅐㅇ성
- refresh token을 DB 또는 Redis에 저장
- 유저정보, access token, refresh token을 프론트로 전달
- access token 만료시 refresh token 검증 후, 재발급

<img width="771" alt="스크린샷 2024-08-17 오후 9 02 37" src="https://github.com/user-attachments/assets/614f2a5a-3893-4824-bb05-99f516e3e51e">

### 프로퍼티 객체 생성 - OAuth2ClientProperties
- 스프링 시큐리티를 사용할 떄, 단지 application.yml 에 client-id, client-secret 등의 정보만 적어주었지만, 신기하게도 설정파일에 적어준 정보를 가지고 로그인이 잘 진행되었다.
- 이 이유는 스프링 시큐리티는 설정 파일에 적어준 정보들로 애플리케이션 실행 시 **OAuth2ClientProperties** 객체를 생성한다.

<img width="768" alt="스크린샷 2024-08-18 오전 12 57 15" src="https://github.com/user-attachments/assets/0e0cdd65-b452-4b61-9122-93a9cad7e5eb">
위 와 아래가 비슷한 구조인 것을 볼 수 있다. 설정 파일에 적어준 정보들이 객체로 만들어져 사용되는 것이다.
<img width="519" alt="스크린샷 2024-08-18 오전 12 57 56" src="https://github.com/user-attachments/assets/3a39d4d4-8fa3-4742-99cb-4e4bd4213e7c">

아래와 같이 **ConfigurationProperties** 어노테이션으로 우리가 설정 파일에 적어준 정보들을 **OAuth2ClientProperties** 필드에 주입하여 객체를 만들어준다.


<img width="669" alt="스크린샷 2024-08-18 오전 1 00 30" src="https://github.com/user-attachments/assets/f2470123-87aa-498c-bb76-e5d455b48499">



### OAuth 로그인 요청 처리 정리

결국 OAuth 로그인 요청이 들어오면 spring security는 아래와 같은 과정을 수행한다.
1. <code>/oauth2/authorization/{registrationId}</code>로 요청이 오면 <code>OAuth2AuthorizationRequestRedirectFilterOAuth2AuthorizationRequestRedirectFilter</code>에서 registrationId에 따라 아이디 / 비밀번호를 입력할 수 있는 uri로 리다이렉트 시킨다.
2. 아이디 / 비밀번호를 입력 후 얻을 수 있는 authorization code로 OAuth2LoginAuthenticationFilter에서 OAuth2 server와 소통한다.
   1. <code>OAuth2LoginAuthenticationProvider</code>를 통해 access token을 얻어온다.
   2. <code>OAuth2LoginAuthenticationProvider</code>를 통해 access token을 이용해서 유저 정보를 얻어온다.

### 최종 정리

1. 애플리케이션을 실행한다.
2. application.yml파일을 읽어 <code>OAuth2ClientProperties</code> 생성 한다.
3. <code>OAuth2ClientPropertiesRegistrationAdapter</code>를 통해 OAuth2ClientProperties에서 각 OAuth2 server 마다 <code>ClientRegistration</code> 생성 한다.
4. <code>ClientRegistration</code> 리스트를 <code>InMemoryClientRegistrationRepository</code>에 저장 한다.
5. <code>/oauth2/authorization/{registrationId}</code>로 OAuth2 로그인 요청을 한다.
6. 요청이 오면 <code>OAuth2AuthorizationRequestRedirectFilter</code>에서 registrationId에 따라 아이디 / 비밀번호를 입력할 수 있는 uri로 리다이렉트 시킨다.
7. 아이디 / 비밀번호를 입력 후 얻을 수 있는 authorization code로 <code>OAuth2LoginAuthenticationFilter</code>에서 OAuth2 server와 소통한다.
   1. <code>OAuth2LoginAuthenticationProvider</code>를 통해 access token을 얻어온다.
   2. <code>OAuth2LoginAuthenticationProvider</code>를 통해 access token을 이용해서 유저 정보를 얻어온다.
   3. 




