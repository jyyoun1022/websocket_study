package websocket.lab.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import websocket.lab.domain.oauth.OAuthService;

@Configuration
@EnableWebSecurity  // spring security 설정을 활성화해주는 어노테이션
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuthService oAuthService;


    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(request -> request
                        .anyRequest().authenticated()) // 모든 요청이 인증을 요구하도록 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo  // 사용자 정보를 가져올 때 설정 담당
                                .userService(oAuthService)));   // OAuth2  로그인 성공 시 후작업을 진행할 UserService설정

        return http.build();
    }
}
