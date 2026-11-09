package com.piedraazul.dto;

import java.util.Map;

public record ErrorRespuesta(int estado, String mensaje, Map<String, String> errores) {
}
