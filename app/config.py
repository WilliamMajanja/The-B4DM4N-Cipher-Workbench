import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "The B4DM4N Cipher Workbench"
    app_version: str = "2.0.0"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    allowed_hosts: str = "localhost,127.0.0.1"

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3:latest"
    ollama_timeout: int = 120

    max_ciphertext_length: int = 100_000
    max_keyword_length: int = 1000
    rate_limit_per_minute: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
