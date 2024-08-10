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
        // 해당 주소를 구독하는 클라이언트에게 메시지를 보낸다. (구독 요청의 prefix)
        // 클라이언트 1번 채널을 구독하고자 할 때는 /sub/1과 같은 규칙을 따라야
        registry.enableSimpleBroker("/sub");
        // 메시지 발행 요청의 prefix,
        // pub으로 시작하는 메시지만 해당 Broker에서 처리한다.
        registry.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // ex ) ws://localhost:9000/stomp/chat
        // 클라이언트에서 Websocket에 접속할 수 있는 endPoint를 지정
        registry.addEndpoint("/stomp/chat")
                .setAllowedOriginPatterns("*").withSockJS();
    }

    // 웹 소켓 연결에 연결될떄와 끊길때의 추가기능 (인증, 세션관리 )
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
//        registration.interceptors(stompHandler);
    }


}
