package com.jinqitrip.jtcn.modules.auth.repository;

import com.jinqitrip.jtcn.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * 根据用户名查找用户
     *
     * @param username 用户名
     * @return 用户实体，如果未找到则返回 Optional.empty()
     */
    Optional<User> findByUsername(String username);
}