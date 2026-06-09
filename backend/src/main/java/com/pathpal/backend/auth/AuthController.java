package com.pathpal.backend.auth;

import java.net.URI;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final String frontendUrl;

    public AuthController(@Value("${pathpal.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.removeAttribute(GitHubAuthController.USER_ID_KEY);
        }

        return ResponseEntity.status(HttpStatus.FOUND)
            .location(frontendLocation("/"))
            .build();
    }

    private URI frontendLocation(String path) {
        return UriComponentsBuilder.fromUriString(frontendUrl + path)
            .build()
            .toUri();
    }
}
