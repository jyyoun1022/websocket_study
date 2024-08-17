package websocket.lab.domain.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import websocket.lab.type.OAuthProviderType;
import websocket.lab.type.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {

    private String oauthId;
    private String name;
    private String email;
    private String imageUrl;
    private OAuthProviderType providerType;

    public Member toMember() {
        return Member.builder()
                .oauthId(this.oauthId)
                .name(this.name)
                .email(this.email)
                .imageUrl(this.imageUrl)
                .role(Role.USER)
                .providerType(this.providerType)
                .build();
    }
}
