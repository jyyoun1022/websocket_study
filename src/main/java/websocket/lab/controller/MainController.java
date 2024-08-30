package websocket.lab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import websocket.lab.dto.ApiResponseDto;
import websocket.lab.entity.ChatRoom;
import websocket.lab.service.ChatService;

import java.util.LinkedList;

@Controller
@RequiredArgsConstructor
public class MainController {

    private final ChatService chatService;

    @GetMapping("/test")
    public String main() {
        return "socketMain";
    }

    //채팅방 목록
    @GetMapping("/chatRoomList")
    @ResponseBody
    public ApiResponseDto<?> chatRoomList() {
        LinkedList<ChatRoom> chattingList = chatService.getChattingList();
        return ApiResponseDto.builder()
                .result(chattingList.size() == 0 ? false : true)
                .data(chattingList).build();
    }


}
