package websocket.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import websocket.lab.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
