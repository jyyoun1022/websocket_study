package websocket.lab.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import websocket.lab.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
}
