package com.medicontinuum.backend.notification.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnBean(JavaMailSender.class)
@ConditionalOnProperty(
    prefix = "notification.email",
    name = "enabled",
    havingValue = "true"
)
public class NotificationEmailSender {

    private final JavaMailSender mailSender;

    public NotificationEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(
        String recipientEmail,
        String subject,
        String message
    ) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(recipientEmail);
        mail.setSubject(subject);
        mail.setText(message);

        mailSender.send(mail);
    }
}