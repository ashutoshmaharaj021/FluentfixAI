from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from the .env file.
    """

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

    # ==========================
    # Security
    # ==========================
    SECRET_KEY: str

    # ==========================
    # Database
    # ==========================
    DATABASE_URL: str

    # ==========================
    # AI
    # ==========================
    MODEL_PATH: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()