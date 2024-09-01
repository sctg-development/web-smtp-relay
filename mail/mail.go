// Copyright (c) 2022-2024 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package mail

import (
	"fmt"
	"log"
	"net/smtp"
	"web-smtp-relay/config"
)

// SendMail sends an email using the provided SMTP configuration.
func SendMail(username string, config config.SMTPConfig, subject, body string, destinations []string) error {
	if len(destinations) == 0 {
		log.Println("No destinations provided")
		return fmt.Errorf("no destinations provided")
	}
	for _, dest := range destinations {
		if dest == "" {
			log.Println("Empty destination provided")
			return fmt.Errorf("empty destination provided")
		}
	}
	if subject == "" {
		log.Println("No subject provided")
		return fmt.Errorf("no subject provided")
	}
	if body == "" {
		log.Println("No body provided")
		return fmt.Errorf("no body provided")
	}
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)

	msg := fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", destinations[0], subject, body)

	log.Printf("Sending email for %s to %s with subject: %s", username, destinations[0], subject)

	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", config.Host, config.Port),
		auth,
		config.Username,
		destinations,
		[]byte(msg),
	)

	return err
}
