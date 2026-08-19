from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    

    # ==========================
    # Application
    # ==========================
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool

    # ==========================
    # API
    # ==========================
    API_V1_PREFIX: str
    FRONTEND_URL: str

    # ==========================
    # Security
    # ==========================
    SECRET_KEY: str

    # ==========================
    # Database
    # ==========================
    DATABASE_HOST: str
    DATABASE_PORT: int
    DATABASE_NAME: str
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_URL: str
    

    # ==========================
    # AI
    # ==========================
    MODEL_PATH: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()