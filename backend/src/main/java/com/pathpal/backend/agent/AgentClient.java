package com.pathpal.backend.agent;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AgentClient {

    private final RestClient restClient;

    public AgentClient(
            @Value("${pathpal.agent.base-url:http://localhost:8001}") String agentBaseUrl) {
        this.restClient = RestClient.builder().baseUrl(agentBaseUrl).build();
    }

    public AgentChatResponse chat(AgentChatRequest request) {
        return restClient.post()
            .uri("/chat")
            .body(request)
            .retrieve()
            .body(AgentChatResponse.class);
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
