package websocket.lab.domain.member;

import jakarta.persistence.*;
import lombok.*;
import websocket.lab.type.OAuthProviderType;
import websocket.lab.type.Role;

@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String oauthId;

    private String name;

    private String email;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    private OAuthProviderType providerType;

    public Member update(String name, String email, String imageUrl) {
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        return this;
    }

}
