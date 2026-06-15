package com.pathpal.backend.agent;

import java.util.List;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class AgentClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AgentClient(
            ObjectMapper objectMapper,
            @Value("${pathpal.agent.base-url:http://localhost:8001}") String agentBaseUrl) {
        this.restClient = RestClient.builder()
            .baseUrl(agentBaseUrl)
            .requestFactory(new SimpleClientHttpRequestFactory())
            .build();
        this.objectMapper = objectMapper;
    }

    public AgentChatResponse chat(AgentChatRequest request) {
        try {
            String requestBody = objectMapper.writeValueAsString(request);
            String responseBody = restClient.post()
                .uri("/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .header("X-PathPal-Client", "spring-backend")
                .body(requestBody)
                .retrieve()
                .body(String.class);

            return objectMapper.readValue(responseBody, AgentChatResponse.class);
        } catch (JacksonException exception) {
            throw new RestClientException("Could not serialize agent request or response", exception);
        }
    }

    public record AgentChatRequest(
            AgentProject project,
            List<AgentFile> files,
            String message) {
    }

    public record AgentProject(
            Long id,
            String title,
            String deadline,
            String description) {
    }

    public record AgentFile(
            Long fileId,
            String name,
            String path) {
    }

    public record AgentChatResponse(
            String answer,
            List<AgentCitation> citations) {
    }

    public record AgentCitation(
            Long fileId,
            String fileName,
            int page,
            String text) {
    }
}
