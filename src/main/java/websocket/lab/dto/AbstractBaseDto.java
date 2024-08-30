package websocket.lab.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;

import java.io.Serializable;

@Getter
@NoArgsConstructor
public abstract class AbstractBaseDto implements Serializable {
    private static final long serialVersionUID = 1L;

    @JsonIgnore
    private final String lang = LocaleContextHolder.getLocale().getLanguage();



}
