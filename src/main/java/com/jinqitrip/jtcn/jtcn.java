package com.jinqitrip.jtcn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.CommandLineRunner;

@EnableAsync       // 启用异步处理
@EnableScheduling  // 启用定时任务
@EnableJpaAuditing // 启用JPA审计
@SpringBootApplication
public class jtcn {

    public static void main(String[] args) {
        SpringApplication.run(jtcn.class, args);
    }

    // 应用启动完成时执行的初始化操作
    @Bean
    public CommandLineRunner init() {
        return args -> {
            System.out.println("\n=================================");
            System.out.println("  Campus Guide Service Started!");
            System.out.println("=================================\n");
        };
    }

    // 监听应用就绪事件
    @EventListener(ApplicationReadyEvent.class)
    public void doAfterStartup() {
        // 可添加缓存预热等初始化逻辑
    }
}