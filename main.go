// Copyright (c) 2022-2024 Ronan LE MEILLAT
// This program is licensed under the AGPLv3 license.
package main

import (
	_ "embed"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"web-smtp-relay/auth"
	"web-smtp-relay/config"
	"web-smtp-relay/mail"
)

//go:embed not-found.html
var notFoundHTML []byte

type Message struct {
	Subject      string   `json:"subject"`
	Body         string   `json:"body"`
	Destinations []string `json:"destinations"`
}

func main() {
	configFile := flag.String("c", "", "Path to config file")
	port := flag.String("p", "", "Port to listen on")
	flag.Parse()

	cfg, err := config.Load(*configFile)
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if *port != "" {
		cfg.Port = *port
	}

	http.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		username, password, ok := r.BasicAuth()
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if !auth.Authenticate(username, password, cfg.Users) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var msg Message
		err := json.NewDecoder(r.Body).Decode(&msg)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Printf("Error decoding request body: %v", err)
			return
		}

		err = mail.SendMail(cfg.SMTP, msg.Subject, msg.Body, msg.Destinations)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error sending email: %v", err), http.StatusInternalServerError)
			log.Printf("Error sending email: %v", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Email sent successfully"))
	})

	// If user hits any other endpoint, return a 404 error with the content of the file not-found.html
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Not found: %s, IP: %s", r.URL.Path, r.RemoteAddr)
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusNotFound)
		w.Write(notFoundHTML)
	})

	log.Printf("Server starting on :%s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}
