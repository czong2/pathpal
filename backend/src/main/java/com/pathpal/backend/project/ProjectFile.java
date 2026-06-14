package com.pathpal.backend.project;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_files")
public class ProjectFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private PathProject project;

    @Column(nullable = false)
    private String originalFilename;

    @Column(nullable = false)
    private String storagePath;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    @Column(nullable = false)
    private Instant createdAt;

    protected ProjectFile() {
    }

    public ProjectFile(String originalFilename, String storagePath, String contentType, long sizeBytes) {
        this.originalFilename = originalFilename;
        this.storagePath = storagePath;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    void setProject(PathProject project) {
        this.project = project;
    }
}
