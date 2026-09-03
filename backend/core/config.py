from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    # Debug
    DEBUG: str = "False"
    DEBUG_MAIL: str

    # MySQL
    MYSQL_HOST: str = "localhost"
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = "astralteam"
    MYSQL_PORT: int = 3306
    MYSQL_CHARSET: str = "utf8mb4"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_USER: str = "default"
    REDIS_PASSWORD: str = ""
    REDIS_DATABASE: int = 0
    REDIS_PORT: int = 6379
    REDIS_MAX_CONNECTIONS: int = 10

    # Email
    VERIFY_HOSTNAME: str = "mail.astralteam.ru"
    VERIFY_USERNAME: str
    VERIFY_PASSWORD: str
    VERIFY_PORT: int = 587

    # MySQL Pool
    MYSQL_POOL_SIZE_MIN: int = 10
    MYSQL_POOL_SIZE_MAX: int = 20

    # CORS and URI
    
    CORS_ORIGINS: str
    FRONTEND_URL: str
    BACKEND_URL: str

    # Yoomoney

    PAYMENT_SYSTEM_API_KEY: str

    ###

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()