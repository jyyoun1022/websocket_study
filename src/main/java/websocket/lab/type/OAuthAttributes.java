package websocket.lab.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import websocket.lab.domain.member.UserProfile;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

@RequiredArgsConstructor
@Getter
public enum OAuthAttributes {
    GITHUB("github", (attributes) -> {
        return UserProfile.builder()
                .oauthId(String.valueOf(attributes.get("id")))
                .name(String.valueOf(attributes.get("name")))
                .email(String.valueOf(attributes.get("email")))
                .imageUrl(String.valueOf(attributes.get("avatar_url")))
                .providerType(OAuthProviderType.GITHUB)
                .build();
    }),
    GOOGLE("google", (attributes) -> {
        return UserProfile.builder()
                .oauthId(String.valueOf(attributes.get("sub")))
                .name(String.valueOf(attributes.get("name")))
                .email(String.valueOf(attributes.get("email")))
                .imageUrl(String.valueOf(attributes.get("picture")))
                .providerType(OAuthProviderType.GOOGLE)
                .build();
    });

    private final String registrationId;
    private final Function<Map<String, Object>, Object> of;


    public static UserProfile extract(String registrationId, Map<String, Object> attributes) {
        return (UserProfile) Arrays.stream(values())
                .filter(provider -> registrationId.equals(provider.registrationId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException())
                .of.apply(attributes);
    }
}
