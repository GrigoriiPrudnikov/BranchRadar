// Package branchradar is the main package for the branch-radar command.
package main

import (
	"log"
	"net/http"

	"branch-radar/internal/api"

	"github.com/joho/godotenv"
)

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // your frontend
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	godotenv.Load()

	mux := http.NewServeMux()
	mux.HandleFunc("GET /verify-installation", api.VerifyInstallationHandler)

	log.Println("Server listening on :8080")

	err := http.ListenAndServe(":8080", cors(mux))
	if err != nil {
		log.Fatal(err)
	}
}
