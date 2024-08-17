package websocket.lab.domain.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import websocket.lab.domain.member.Member;
import websocket.lab.domain.member.MemberRepository;
import websocket.lab.domain.member.UserProfile;
import websocket.lab.error.CommonErrorType;
import websocket.lab.exception.CustomOAuth2AuthenticationException;
import websocket.lab.type.OAuthAttributes;
import websocket.lab.type.OAuthProviderType;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuthService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();     // delegate : 대리자(특파, 파견)
        OAuth2User oAuth2User = delegate.loadUser(userRequest); // OAuth 서비스(github, google, naver )에서 가져온 유저 정보를 담고 있음


        String registrationId = userRequest.getClientRegistration().getRegistrationId();// OAuth 서비스 이름( ex. github, naver, google)

        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName(); // OAuth 로그인 시 키(PK)가 되는 값

        Map<String, Object> attributes = oAuth2User.getAttributes();    // OAuth 서비스의 유저 정보들

        UserProfile userProfile = OAuthAttributes.extract(registrationId, attributes);
        //   registrationId에 따라 유저 정보를 통해 공통된 UserProfile 객체로 만들어 줌
        Member member = saveOrUpdate(userProfile);// DB에 저장


        return new DefaultOAuth2User(
                Collections.singletonList(new SimpleGrantedAuthority(member.getRole().getKey())),
                attributes,
                userNameAttributeName
        );
    }

    public Member saveOrUpdate(UserProfile userProfile) {
        String email = userProfile.getEmail();

        //  1. 이메일이 등록되어있는지 확인
        List<Member> memberList = memberRepository.findByEmailLike("%_" + email);

        //  2. 등록되지 않은 경우 : 저장 / 다른 제공사로 등록되어 있는 경우 에러 발생
        Member member = null;
        if (!memberList.isEmpty()) {
            member = memberList.get(0);
            if (!member.getEmail().contains(userProfile.getProviderType().name())) {
                throw new CustomOAuth2AuthenticationException("SERVER_ERROR", CommonErrorType.REGISTERED_EMAIL_FOR_THE_OTHER);
            }
        } else {
            userProfile.setEmail(createOAuthStrEmail(email, userProfile.getProviderType()));
            member = userProfile.toMember();

        }
        return memberRepository.save(member);

    }



    private String createOAuthStrEmail(String email, OAuthProviderType providerType) {
        return providerType.name() + "_" + email;
    }

}
