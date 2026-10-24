package config

import (
	"errors"
	"os"
	"slices"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Debug struct {
	IS   bool
	MAIL string
}

type VEmail struct {
	HOSTNAME string
	USERNAME string
	PASSWORD string
	PORT     string
}

type MySQL struct {
	HOST     string
	USER     string
	PASSWORD string
	DATABASE string
	PORT     string
	CHARSET  string
	POOL_MIN int
	POOL_MAX int
}

type Redis struct {
	HOST            string
	USER            string
	PASSWORD        string
	DATABASE        int
	PORT            string
	MAX_CONNECTIONS int
}

type URL struct {
	CORS_ORIGINS []string
	FRONTEND_URL string
	BACKEND_URL  string
}

type Yookassa struct {
	PAYMENT_SYSTEM_SHOP_ID    string
	PAYMENT_SYSTEM_SECRET_KEY string
}

type Config struct {
	Debug    Debug
	VEmail   VEmail
	MySQL    MySQL
	Redis    Redis
	URL      URL
	Yookassa Yookassa
}

func Load() (Config, error) {
	if err := godotenv.Load(".env"); err != nil {
		return Config{}, err
	}
	config := Config{
		Debug: Debug{
			IS:   getEnv("DEBUG", "False") == "True",
			MAIL: getEnv("DEBUG", "nomail@nomail.nomail"),
		},

		VEmail: VEmail{
			HOSTNAME: getEnv("VERIFY_HOSTNAME", "null"),
			USERNAME: getEnv("VERIFY_USERNAME", "null"),
			PASSWORD: getEnv("VERIFY_PASSWORD", "null"),
			PORT:     getEnv("VERIFY_PORT", "null"),
		},

		MySQL: MySQL{
			HOST:     getEnv("MYSQL_HOST", "127.0.0.1"),
			USER:     getEnv("MYSQL_USER", "root"),
			PASSWORD: getEnv("MYSQL_PASSWORD", ""),
			DATABASE: getEnv("MYSQL_DATABASE", ""),
			PORT:     getEnv("MYSQL_PORT", "3306"),
			CHARSET:  getEnv("MYSQL_CHARSET", "utf8mb4"),
			POOL_MIN: getEnvInt("MYSQL_POOL_SIZE_MIN", 10),
			POOL_MAX: getEnvInt("MYSQL_POOL_SIZE_MAX", 20),
		},

		Redis: Redis{
			HOST:            getEnv("REDIS_HOST", "127.0.0.1"),
			USER:            getEnv("REDIS_USER", "default"),
			PASSWORD:        getEnv("REDIS_PASSWORD", ""),
			DATABASE:        getEnvInt("REDIS_DATABASE", 1),
			PORT:            getEnv("REDIS_PORT", "6973"),
			MAX_CONNECTIONS: getEnvInt("REDIS_MAX_CONNECTIONS", 10),
		},

		URL: URL{
			CORS_ORIGINS: getEnvArray("CORS_ORIGINS", []string{"localhost"}),
			FRONTEND_URL: getEnv("FRONTEND_URL", "http://127.0.0.1:5173"),
			BACKEND_URL:  getEnv("BACKEND_URL", "http://127.0.0.1:8000"),
		},

		Yookassa: Yookassa{
			PAYMENT_SYSTEM_SHOP_ID:    getEnv("PAYMENT_SYSTEM_SHOP_ID", "null"),
			PAYMENT_SYSTEM_SECRET_KEY: getEnv("PAYMENT_SYSTEM_SECRET_KEY", "null"),
		},
	}

	validate_err := validate(
		config.VEmail.HOSTNAME,
		config.VEmail.USERNAME,
		config.VEmail.PASSWORD,
		config.VEmail.PORT,
		config.Yookassa.PAYMENT_SYSTEM_SECRET_KEY,
		config.Yookassa.PAYMENT_SYSTEM_SHOP_ID,
	)

	if validate_err != nil {
		return config, validate_err
	}

	return config, nil
}

func validate(values ...string) error {
	if slices.Contains(values, "null") {
		return errors.New(".env not have important options!")
	}
	return nil
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func getEnvArray(key string, fallback []string) []string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return strings.Split(value, ",")
}

func getEnvInt(key string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return fallback
	}
	return value
}
