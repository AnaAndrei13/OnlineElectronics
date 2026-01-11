package com.electronics.OnlineElectronics.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.path:D:/uploads}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String normalizedPath = uploadPath;
        if (!normalizedPath.endsWith("/") && !normalizedPath.endsWith("\\")) {
            normalizedPath = normalizedPath + "/";
        }
        String fileLocation = "file:///" + normalizedPath;

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileLocation);

        System.out.println("=================================");
        System.out.println("Static resources configured:");
        System.out.println("URL pattern: /uploads/**");
        System.out.println("File location: " + fileLocation);
        System.out.println("Actual path: " + normalizedPath);
        System.out.println("=================================");
    }
}
