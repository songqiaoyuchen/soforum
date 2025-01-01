package utils

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// GenerateJWT generates a JWT for a given username
func GenerateJWT(username string) (string, error) {
	jwtSecretKey := []byte(os.Getenv("JWT_SECRET_KEY"))
	// Create a new JWT token with the HMAC
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims for the token
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = username
	claims["exp"] = time.Now().Add(time.Minute * 1).Unix() // Token expires in 1 minutes

	// Sign the token with the secret key
	signedToken, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
