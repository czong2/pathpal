package com.pathpal.backend.project;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import com.pathpal.backend.auth.GitHubAuthController;
import com.pathpal.backend.user.User;
import com.pathpal.backend.user.UserRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProject(
            @RequestParam String title,
            @RequestParam String icon,
            @RequestParam String color,
            @RequestParam String deadline,
            @RequestParam String description,
            @RequestPart(required = false) List<MultipartFile> files,
            HttpSession session) {
        Long userId = (Long) session.getAttribute(GitHubAuthController.USER_ID_KEY);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!StringUtils.hasText(title)) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Project title is required."));
        }

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        LocalDate parsedDeadline = parseDeadline(deadline);

        if (parsedDeadline == null && StringUtils.hasText(deadline)) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Project deadline must be an ISO date."));
        }

        PathProject project = projectService.createProject(
            user,
            title,
            icon,
            color,
            parsedDeadline,
            description,
            files == null ? List.of() : files
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectResponse.from(project));
    }

    private record ProjectResponse(
            Long id,
            String title,
            String icon,
            String color,
            LocalDate deadline,
            String description,
            List<ProjectFileResponse> files) {

        static ProjectResponse from(PathProject project) {
            return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getIcon(),
                project.getColor(),
                project.getDeadline(),
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

    private LocalDate parseDeadline(String deadline) {
        if (!StringUtils.hasText(deadline)) {
            return null;
        }

        try {
            return LocalDate.parse(deadline);
        } catch (DateTimeParseException exception) {
            return null;
        }
    }
}
