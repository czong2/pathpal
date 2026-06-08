package com.pathpal.backend.session;

import com.pathpal.backend.auth.GitHubAuthController;
import com.pathpal.backend.user.User;
import com.pathpal.backend.user.UserRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    public static final String TURNSTILE_VERIFIED_KEY = "TURNSTILE_VERIFIED";

    private final UserRepository userRepository;

    public SessionController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public SessionResponse getSession(HttpSession session) {
        Long userId = (Long) session.getAttribute(GitHubAuthController.USER_ID_KEY);
        UserSummary user = userId == null
            ? null
            : userRepository.findById(userId).map(UserSummary::from).orElse(null);

        return new SessionResponse(
            Boolean.TRUE.equals(session.getAttribute(TURNSTILE_VERIFIED_KEY)),
            user
        );
    }

    public record SessionResponse(boolean turnstileVerified, UserSummary user) {
    }

    public record UserSummary(Long id, String login, String avatarUrl) {

        static UserSummary from(User user) {
            return new UserSummary(user.getId(), user.getLogin(), user.getAvatarUrl());
        }
    }
}
