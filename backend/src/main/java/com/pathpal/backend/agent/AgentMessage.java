package com.pathpal.backend.agent;

import java.time.Instant;

import com.pathpal.backend.project.PathProject;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "agent_messages")
public class AgentMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private PathProject project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentMessageRole role;

    @Lob
    @Column(nullable = false)
    private String content;

    @Lob
    @Column
    private String citationsJson;

    @Column(nullable = false)
    private Instant createdAt;

    protected AgentMessage() {
    }

    public AgentMessage(PathProject project, AgentMessageRole role, String content, String citationsJson) {
        this.project = project;
        this.role = role;
        this.content = content;
        this.citationsJson = citationsJson;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public AgentMessageRole getRole() {
        return role;
    }

    public String getContent() {
        return content;
    }

    public String getCitationsJson() {
        return citationsJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
