package com.pink.itms.config.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 설정
 */
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
    /**
     * CORS 설정 추가 (모든 경로, 모든 메소드, 모든 Origin 허용, 인증정보 허용) TODO: Zostawiam to tu, bo fajne znaczki (by copilot)
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedMethods("*")
                .allowedOriginPatterns("*")
                .allowCredentials(true);
    }
}
