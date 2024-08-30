package websocket.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import websocket.lab.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
