// Package api is the internal API package for the branch-radar server.
package api

import (
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func loadPrivateKeyFromEnv() (*rsa.PrivateKey, error) {
	raw := os.Getenv("GITHUB_APP_KEY")
	if raw == "" {
		return nil, errors.New("GITHUB_APP_PRIVATE_KEY is not set")
	}

	pemString := strings.ReplaceAll(raw, `\n`, "\n")

	key, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(pemString))
	if err != nil {
		return nil, fmt.Errorf("parsing rsa private key: %w", err)
	}

	return key, nil
}

func getInstallation(appJWT, installationID string) (*http.Response, error) {
	url := fmt.Sprintf("https://api.github.com/app/installations/%s", installationID)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("building request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+appJWT)
	req.Header.Set("Accept", "application/vnd.github+json")

	client := &http.Client{Timeout: 10 * time.Second}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("sending request: %w", err)
	}

	return resp, nil
}

var sessionSecret = []byte(os.Getenv("SESSION_SECRET"))

func createSessionToken(installationID string) (string, error) {
	claims := jwt.MapClaims{
		"installation_id": installationID,
		"exp":             time.Now().Add(21 * 24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(sessionSecret)
}

func VerifyInstallation(installationID string) (*http.Response, error) {
	iss := os.Getenv("GITHUB_APP_ID")
	if iss == "" {
		return nil, errors.New("GITHUB_APP_ID is not set")
	}

	privateKey, err := loadPrivateKeyFromEnv()
	if err != nil {
		return nil, fmt.Errorf("loading private key: %w", err)
	}

	claims := jwt.RegisteredClaims{
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 10)),
		Issuer:    iss,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	ss, err := token.SignedString(privateKey)
	if err != nil {
		return nil, fmt.Errorf("signing token: %w", err)
	}

	installation, err := getInstallation(ss, installationID)
	if err != nil {
		return nil, fmt.Errorf("getting installation: %w", err)
	}

	if installation.StatusCode != http.StatusOK {
		defer installation.Body.Close()
		body, readErr := io.ReadAll(installation.Body)
		if readErr != nil {
			return nil, fmt.Errorf("installation status code: %d (failed to read body: %w)", installation.StatusCode, readErr)
		}
		return nil, fmt.Errorf("installation status code: %d, body: %s", installation.StatusCode, body)
	}

	return installation, nil
}

func VerifyInstallationHandler(w http.ResponseWriter, r *http.Request) {
	installationID := r.URL.Query().Get("installation_id")
	response, err := VerifyInstallation(installationID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		http.Error(w, "installation not found", http.StatusBadRequest)
		return
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var result map[string]any
	if err = json.Unmarshal(body, &result); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	signed, err := createSessionToken(installationID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	result["session_token"] = signed

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
