package com.pathpal.backend.project;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<PathProject, Long> {
    Optional<PathProject> findByIdAndUser_Id(Long id, Long userId);

    @Query(value = """
        select project.*
        from projects project
        left join (
            select project_id, max(created_at) as latest_chat_at
            from agent_messages
            group by project_id
        ) latest_message on latest_message.project_id = project.id
        where project.user_id = :userId
        order by coalesce(latest_message.latest_chat_at, project.created_at) desc, project.id desc
        """, nativeQuery = true)
    List<PathProject> findByUserIdOrderByLatestChat(@Param("userId") Long userId);
}
