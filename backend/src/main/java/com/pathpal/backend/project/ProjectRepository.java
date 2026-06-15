package com.pathpal.backend.project;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<PathProject, Long> {
    Optional<PathProject> findByIdAndUser_Id(Long id, Long userId);
}
