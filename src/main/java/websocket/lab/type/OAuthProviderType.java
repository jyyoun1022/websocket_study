package websocket.lab.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OAuthProviderType {
    NONE(1, "자체 로그인"),
    GITHUB(2, "깃허브 로그인"),
    GOOGLE(3, "구글 로그인");

    private final int key;
    private final String value;
}
