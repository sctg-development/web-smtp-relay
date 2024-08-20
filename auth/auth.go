// Copyright (c) 2022 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package auth

import (
	"golang.org/x/crypto/bcrypt"
)

func Authenticate(username, password string, users map[string]string) bool {
	hashedPassword, ok := users[username]
	if !ok {
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
