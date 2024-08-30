package websocket.lab.config.socket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//    private final StompHandler stompHandler;

    // 메시지를 중간에서 라우팅 할 떄 사용하는 메시지 브로커를 구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /**
         * 메시지 브로커의 설정을 구성함
         * - 클라이언트와 서버 간의 메시지를 라우팅하고 브로드캐스트하는 역할
         *
         * 1. /topic : 클라이언트가 구독할 수 있는 경로를 설정
         */
        registry.enableSimpleBroker("/topic");
        // client가 구독할 수 있는 경로 설정
        // 이 경로로 시작하는 모든 메시지는 메시지 브로커에 의해 처리되고, 해당 경로를 구독한 클라이언트들에게 전송된다.

        registry.setApplicationDestinationPrefixes("/test");
        // client가 서버에 보내는 메시지의 경로를 설정
        // 이 경로로 시작하는 메시지를 서버로 전송하면 이 메시지는 @MessageMapping 과 같은 컨트롤러 메서드에서 처리된다.
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트에서 Websocket에 접속할 수 있는 endPoint를 지정
        registry.addEndpoint("/socketTest")
                .setAllowedOriginPatterns("*").withSockJS();
    }

    // 웹 소켓 연결에 연결될떄와 끊길때의 추가기능 (인증, 세션관리 )
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
//        registration.interceptors(stompHandler);
    }


}
