package com.pathpal.backend.auth;

import java.net.URI;
import java.util.UUID;

import com.pathpal.backend.project.ProjectService;
import com.pathpal.backend.user.User;
import com.pathpal.backend.user.UserService;
import jakarta.servlet.http.HttpSession;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/auth/github")
public class GitHubAuthController {

    private static final Logger log = LoggerFactory.getLogger(GitHubAuthController.class);
    public static final String USER_ID_KEY = "USER_ID";

    private static final String GITHUB_STATE_KEY = "GITHUB_OAUTH_STATE";
    private static final String GITHUB_REMEMBER_KEY = "GITHUB_REMEMBER_LOGIN";
    private static final URI GITHUB_AUTHORIZE_URL = URI.create("https://github.com/login/oauth/authorize");
    private static final URI GITHUB_TOKEN_URL = URI.create("https://github.com/login/oauth/access_token");
    private static final URI GITHUB_USER_URL = URI.create("https://api.github.com/user");

    private final RestClient restClient = RestClient.builder()
        .requestFactory(new SimpleClientHttpRequestFactory())
        .build();
    private final UserService userService;
    private final ProjectService projectService;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String frontendUrl;

    public GitHubAuthController(
            UserService userService,
            ProjectService projectService,
            @Value("${pathpal.github.client-id:}") String clientId,
            @Value("${pathpal.github.client-secret:}") String clientSecret,
            @Value("${pathpal.github.redirect-uri:http://localhost:8080/api/auth/github/callback}") String redirectUri,
            @Value("${pathpal.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.userService = userService;
        this.projectService = projectService;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping
    public ResponseEntity<Void> login(@RequestParam(defaultValue = "false") boolean remember, HttpSession session) {
        if (!StringUtils.hasText(clientId)) {
            log.warn("GitHub login requested without GITHUB_CLIENT_ID");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        String state = UUID.randomUUID().toString();
        session.setAttribute(GITHUB_STATE_KEY, state);
        session.setAttribute(GITHUB_REMEMBER_KEY, remember);

        URI location = UriComponentsBuilder.fromUri(GITHUB_AUTHORIZE_URL)
            .queryParam("client_id", clientId)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("scope", "read:user user:email")
            .queryParam("state", state)
            .build()
            .toUri();

        return ResponseEntity.status(HttpStatus.FOUND).location(location).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            HttpSession session) {
        if (StringUtils.hasText(error) || !StringUtils.hasText(code) || !StringUtils.hasText(state)) {
            log.warn("GitHub callback rejected: error={}, hasCode={}, hasState={}",
                error,
                StringUtils.hasText(code),
                StringUtils.hasText(state)
            );
            return redirectToLoginError();
        }

        String expectedState = (String) session.getAttribute(GITHUB_STATE_KEY);

        if (!StringUtils.hasText(expectedState) || !expectedState.equals(state)) {
            log.warn("GitHub callback rejected: state mismatch. expectedPresent={}, actualPresent={}",
                StringUtils.hasText(expectedState),
                StringUtils.hasText(state)
            );
            return redirectToLoginError();
        }

        try {
            GitHubTokenResponse tokenResponse = exchangeCodeForToken(code);

            if (tokenResponse == null || !StringUtils.hasText(tokenResponse.accessToken())) {
                log.warn("GitHub callback rejected: token response did not contain access token");
                return redirectToLoginError();
            }

            GitHubUserResponse gitHubUser = fetchGitHubUser(tokenResponse.accessToken());

            if (gitHubUser == null || gitHubUser.id() == null || !StringUtils.hasText(gitHubUser.login())) {
                log.warn("GitHub callback rejected: user response was incomplete");
                return redirectToLoginError();
            }

            User user = userService.findOrCreateByGitHubProfile(
                gitHubUser.id(),
                gitHubUser.login(),
                gitHubUser.avatarUrl()
            );

            boolean remember = Boolean.TRUE.equals(session.getAttribute(GITHUB_REMEMBER_KEY));
            session.setAttribute(USER_ID_KEY, user.getId());
            session.removeAttribute(GITHUB_STATE_KEY);
            session.removeAttribute(GITHUB_REMEMBER_KEY);
            session.setMaxInactiveInterval(remember ? 7 * 24 * 60 * 60 : 60 * 60);

            return ResponseEntity.status(HttpStatus.FOUND).location(frontendLocation(postSignInPath(user))).build();
        } catch (RuntimeException exception) {
            log.warn("GitHub callback failed", exception);
            return redirectToLoginError();
        }
    }

    private GitHubTokenResponse exchangeCodeForToken(String code) {
        if (!StringUtils.hasText(clientSecret)) {
            return null;
        }

        var form = new LinkedMultiValueMap<String, String>();
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("code", code);
        form.add("redirect_uri", redirectUri);

        return restClient.post()
            .uri(GITHUB_TOKEN_URL)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .accept(MediaType.APPLICATION_JSON)
            .body(form)
            .retrieve()
            .body(GitHubTokenResponse.class);
    }

    private GitHubUserResponse fetchGitHubUser(String accessToken) {
        return restClient.get()
            .uri(GITHUB_USER_URL)
            .headers(headers -> headers.setBearerAuth(accessToken))
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .body(GitHubUserResponse.class);
    }

    private URI frontendLocation(String path) {
        return UriComponentsBuilder.fromUriString(frontendUrl + path)
            .build()
            .toUri();
    }

    private String postSignInPath(User user) {
        return projectService.findProjectsForSidebar(user.getId())
            .stream()
            .findFirst()
            .map(project -> "/agent/" + project.getId())
            .orElse("/agent");
    }

    private ResponseEntity<Void> redirectToLoginError() {
        return ResponseEntity.status(HttpStatus.FOUND).location(frontendLocation("/login?error=github")).build();
    }

    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    private record GitHubTokenResponse(
            String accessToken,
            String tokenType,
            String scope) {
    }

    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    private record GitHubUserResponse(
            Long id,
            String login,
            String avatarUrl) {
    }
}
