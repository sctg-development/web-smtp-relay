// Copyright (c) 2022 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package mail

import (
	"fmt"
	"net/smtp"
	"web-smtp-relay/config"
)

func SendMail(config config.SMTPConfig, subject, body string, destinations []string) error {
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)

	msg := fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", destinations[0], subject, body)

	err := smtp.SendMail(
		fmt.Sprintf("%s:%d", config.Host, config.Port),
		auth,
		config.Username,
		destinations,
		[]byte(msg),
	)

	return err
}
