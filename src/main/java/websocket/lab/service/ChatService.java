package websocket.lab.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import websocket.lab.repository.ChatRoomRepository;
import websocket.lab.repository.MessageRepository;
import websocket.lab.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
}
