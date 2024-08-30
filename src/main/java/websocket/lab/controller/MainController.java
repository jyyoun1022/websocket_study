package websocket.lab.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
public class MainController {

    @GetMapping("/test")
    public String main() {
        return "socketMain";
    }
    @GetMapping("/init")
    public String test2() {
        return "test";
    }
}
