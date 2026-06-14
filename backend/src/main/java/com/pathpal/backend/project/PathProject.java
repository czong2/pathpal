package com.pathpal.backend.project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.pathpal.backend.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class PathProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String icon;

    @Column(nullable = false)
    private String color;

    @Column
    private LocalDate deadline;

    @Column(length = 4000)
    private String description;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectFile> files = new ArrayList<>();

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected PathProject() {
    }

    public PathProject(User user, String title, String icon, String color, LocalDate deadline, String description) {
        this.user = user;
        this.title = title;
        this.icon = icon;
        this.color = color;
        this.deadline = deadline;
        this.description = description;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getIcon() {
        return icon;
    }

    public String getColor() {
        return color;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<ProjectFile> getFiles() {
        return files;
    }

    public void addFile(ProjectFile file) {
        files.add(file);
        file.setProject(this);
    }
}
