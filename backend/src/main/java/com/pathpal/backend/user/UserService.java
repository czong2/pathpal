package com.pathpal.backend.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User findOrCreateByGitHubProfile(Long githubId, String login, String avatarUrl) {
        return userRepository.findByGithubId(githubId)
            .map(user -> {
                user.updateGitHubProfile(login, avatarUrl);
                return user;
            })
            .orElseGet(() -> userRepository.save(new User(githubId, login, avatarUrl)));
    }
}
