package com.pathpal.backend.project;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.pathpal.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final Path storageRoot;

    public ProjectService(
            ProjectRepository projectRepository,
            @Value("${pathpal.storage-dir:./data}") String storageDir) {
        this.projectRepository = projectRepository;
        this.storageRoot = Path.of(storageDir);
    }

    @Transactional
    public PathProject createProject(
            User user,
            String title,
            String icon,
            String color,
            LocalDate deadline,
            String description,
            List<MultipartFile> files) {
        PathProject project = projectRepository.save(new PathProject(
            user,
            title.trim(),
            icon,
            color,
            deadline,
            StringUtils.hasText(description) ? description.trim() : null
        ));

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            project.addFile(storeFile(project.getId(), file));
        }

        return project;
    }

    @Transactional
    public PathProject addFiles(PathProject project, List<MultipartFile> files) {
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            project.addFile(storeFile(project.getId(), file));
        }

        return projectRepository.save(project);
    }

    private ProjectFile storeFile(Long projectId, MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null
            ? "document.pdf"
            : file.getOriginalFilename());
        String extension = originalFilename.toLowerCase().endsWith(".pdf") ? ".pdf" : "";
        String storedFilename = UUID.randomUUID() + extension;
        Path projectDirectory = storageRoot.resolve("projects").resolve(String.valueOf(projectId)).resolve("files")
            .toAbsolutePath()
            .normalize();
        Path destination = projectDirectory.resolve(storedFilename).toAbsolutePath().normalize();

        if (!destination.startsWith(projectDirectory)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        try {
            Files.createDirectories(projectDirectory);
            Files.copy(file.getInputStream(), destination);
        } catch (IOException exception) {
            throw new UncheckedIOException(exception);
        }

        return new ProjectFile(
            originalFilename,
            storageRoot.relativize(destination).toString(),
            file.getContentType() == null ? "application/pdf" : file.getContentType(),
            file.getSize()
        );
    }
}
