package websocket.lab.exception;

import lombok.Getter;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import websocket.lab.error.CommonErrorType;

@Getter
public class CustomOAuth2AuthenticationException extends OAuth2AuthenticationException {

    private final CommonErrorType errorType;

    public CustomOAuth2AuthenticationException(String errorCode) {
        super(errorCode);
        this.errorType = CommonErrorType.UNKNOWN;
    }

    public CustomOAuth2AuthenticationException(String errorCode, CommonErrorType errorType) {
        super(errorCode);
        this.errorType = errorType;
    }
}