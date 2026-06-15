package com.pathpal.backend.agent;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.pathpal.backend.auth.GitHubAuthController;
import com.pathpal.backend.project.PathProject;
import com.pathpal.backend.project.ProjectFile;
import com.pathpal.backend.project.ProjectRepository;
import com.pathpal.backend.project.ProjectService;
import jakarta.servlet.http.HttpSession;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestClientException;

@RestController
@RequestMapping("/api/projects/{projectId}/agent")
public class AgentController {

    private final AgentClient agentClient;
    private final AgentMessageRepository agentMessageRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final ObjectMapper objectMapper;
    private final Path storageRoot;

    public AgentController(
            AgentClient agentClient,
            AgentMessageRepository agentMessageRepository,
            ProjectRepository projectRepository,
            ProjectService projectService,
            ObjectMapper objectMapper,
            @Value("${pathpal.storage-dir:./data}") String storageDir) {
        this.agentClient = agentClient;
        this.agentMessageRepository = agentMessageRepository;
        this.projectRepository = projectRepository;
        this.projectService = projectService;
        this.objectMapper = objectMapper;
        this.storageRoot = Path.of(storageDir).toAbsolutePath().normalize();
    }

    @GetMapping
    public ResponseEntity<?> getProject(@PathVariable Long projectId, HttpSession session) {
        PathProject project = findProject(projectId, session);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(ProjectAgentResponse.from(project));
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long projectId, HttpSession session) {
        PathProject project = findProject(projectId, session);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(agentMessageRepository.findByProject_IdOrderByCreatedAtAscIdAsc(project.getId())
            .stream()
            .map(this::toMessageResponse)
            .toList());
    }

    @PostMapping(value = "/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addFiles(
            @PathVariable Long projectId,
            @RequestPart(required = false) List<MultipartFile> files,
            HttpSession session) {
        PathProject project = findProject(projectId, session);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        PathProject updatedProject = projectService.addFiles(project, files == null ? List.of() : files);

        return ResponseEntity.ok(updatedProject.getFiles().stream().map(ProjectFileResponse::from).toList());
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @PathVariable Long projectId,
            @RequestBody ChatRequest request,
            HttpSession session) {
        if (request == null || !StringUtils.hasText(request.message())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Message is required."));
        }

        PathProject project = findProject(projectId, session);

        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        AgentClient.AgentChatRequest agentRequest = new AgentClient.AgentChatRequest(
            new AgentClient.AgentProject(
                project.getId(),
                project.getTitle(),
                project.getDeadline() == null ? null : project.getDeadline().toString(),
                project.getDescription()
            ),
            project.getFiles().stream().map(this::toAgentFile).toList(),
            request.message().trim()
        );

        AgentMessage userMessage = agentMessageRepository.save(new AgentMessage(
            project,
            AgentMessageRole.USER,
            request.message().trim(),
            null
        ));

        try {
            AgentClient.AgentChatResponse response = agentClient.chat(agentRequest);
            AgentMessage agentMessage = agentMessageRepository.save(new AgentMessage(
                project,
                AgentMessageRole.AGENT,
                response.answer(),
                writeCitations(response.citations())
            ));

            return ResponseEntity.ok(ChatResponse.from(
                toMessageResponse(userMessage),
                toMessageResponse(agentMessage)
            ));
        } catch (RestClientException exception) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ErrorResponse("Agent service is unavailable or failed to answer."));
        }
    }

    private PathProject findProject(Long projectId, HttpSession session) {
        Long userId = (Long) session.getAttribute(GitHubAuthController.USER_ID_KEY);

        if (userId == null) {
            return null;
        }

        return projectRepository.findByIdAndUser_Id(projectId, userId).orElse(null);
    }

    private AgentClient.AgentFile toAgentFile(ProjectFile file) {
        Path filePath = storageRoot.resolve(file.getStoragePath()).toAbsolutePath().normalize();

        return new AgentClient.AgentFile(
            file.getId(),
            file.getOriginalFilename(),
            filePath.toString()
        );
    }

    private MessageResponse toMessageResponse(AgentMessage message) {
        return new MessageResponse(
            message.getId(),
            message.getRole() == AgentMessageRole.USER ? "You" : "Agent",
            message.getContent(),
            readCitations(message.getCitationsJson()),
            message.getCreatedAt().toString()
        );
    }

    private String writeCitations(List<AgentClient.AgentCitation> citations) {
        if (citations == null || citations.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(citations);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Could not serialize citations", exception);
        }
    }

    private List<AgentClient.AgentCitation> readCitations(String citationsJson) {
        if (!StringUtils.hasText(citationsJson)) {
            return List.of();
        }

        try {
            return objectMapper.readValue(
                citationsJson,
                objectMapper.getTypeFactory().constructCollectionType(ArrayList.class, AgentClient.AgentCitation.class)
            );
        } catch (JacksonException exception) {
            return List.of();
        }
    }

    private record ChatRequest(String message) {
    }

    private record ChatResponse(MessageResponse userMessage, MessageResponse agentMessage) {

        static ChatResponse from(MessageResponse userMessage, MessageResponse agentMessage) {
            return new ChatResponse(userMessage, agentMessage);
        }
    }

    private record MessageResponse(
            Long id,
            String from,
            String text,
            List<AgentClient.AgentCitation> citations,
            String createdAt) {
    }

    private record ProjectAgentResponse(
            Long id,
            String title,
            String icon,
            String color,
            String deadline,
            String description,
            List<ProjectFileResponse> files) {

        static ProjectAgentResponse from(PathProject project) {
            return new ProjectAgentResponse(
                project.getId(),
                project.getTitle(),
                project.getIcon(),
                project.getColor(),
                project.getDeadline() == null ? null : project.getDeadline().toString(),
                project.getDescription(),
                project.getFiles().stream().map(ProjectFileResponse::from).toList()
            );
        }
    }

    private record ProjectFileResponse(Long id, String name, String contentType, long sizeBytes) {

        static ProjectFileResponse from(ProjectFile file) {
            return new ProjectFileResponse(
                file.getId(),
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSizeBytes()
            );
        }
    }

    private record ErrorResponse(String message) {
    }
}
