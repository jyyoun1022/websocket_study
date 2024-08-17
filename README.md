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

<img width="794" alt="스크린샷 2024-08-17 오후 8 35 10" src="https://github.com/user-attachments/assets/a00144d3-cd6c-4e9b-8f4c-db97b5a01b8a">

### Authorization Code Grant
- OAu




