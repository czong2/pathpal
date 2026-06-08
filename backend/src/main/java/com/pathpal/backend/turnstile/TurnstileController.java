package com.pathpal.backend.turnstile;

import java.util.Map;

import com.pathpal.backend.session.SessionController;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/turnstile")
public class TurnstileController {

    private final TurnstileService turnstileService;

    public TurnstileController(TurnstileService turnstileService) {
        this.turnstileService = turnstileService;
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@Valid @RequestBody TurnstileVerifyRequest request,
            HttpSession session) {
        if (!turnstileService.verify(request.token())) {
            session.removeAttribute(SessionController.TURNSTILE_VERIFIED_KEY);

            return ResponseEntity.status(403).body(Map.of(
                "turnstileVerified", false
            ));
        }

        session.setAttribute(SessionController.TURNSTILE_VERIFIED_KEY, true);

        return ResponseEntity.ok(Map.of(
            "turnstileVerified", true,
            "redirectTo", "/"
        ));
    }

    public record TurnstileVerifyRequest(@NotBlank String token) {
    }
}
