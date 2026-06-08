package com.pathpal.backend.turnstile;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
public class TurnstileService {

    private static final URI SITEVERIFY_URL = URI.create("https://challenges.cloudflare.com/turnstile/v0/siteverify");

    private final RestClient restClient;
    private final String secretKey;

    public TurnstileService(@Value("${pathpal.turnstile.secret-key:}") String secretKey) {
        this.restClient = RestClient.builder().build();
        this.secretKey = secretKey;
    }

    public boolean verify(String token) {
        if (!StringUtils.hasText(secretKey) || !StringUtils.hasText(token)) {
            return false;
        }

        var form = new LinkedMultiValueMap<String, String>();
        form.add("secret", secretKey);
        form.add("response", token);

        var response = restClient.post()
            .uri(SITEVERIFY_URL)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(form)
            .retrieve()
            .body(TurnstileSiteVerifyResponse.class);

        return response != null && response.success();
    }
}
