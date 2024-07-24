package com.pink.itms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pdf.generator.PdfGeneratorService;

@Configuration
public class PdfGeneratorConfig {

    @Bean
    public PdfGeneratorService pdfGeneratorService() {
        return new PdfGeneratorService();
    }
}
