// Copyright (c) 2022-2024 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package auth

import (
	"log"
	"web-smtp-relay/config"

	"golang.org/x/crypto/bcrypt"
)

// Authenticate checks if the provided username and password are valid.
func Authenticate(username, password string, users map[string]config.User) bool {
	hashedPassword := users[username].Password
	if hashedPassword == "" {
		log.Printf("User %s not found", username)
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		log.Printf("Authentication failed for user %s", username)
		return false
	}
	return err == nil
}
