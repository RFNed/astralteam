from dotenv import load_dotenv
from os import getenv

load_dotenv()

class Config:
    def __init__(self):
        self.frontend_url = getenv("WEBSITE_URL")
        self.is_debug = getenv("IS_DEBUG", "False")
        self.github = getenv("GITHUB_URL", "https://github.com")
        self.teamspeak = getenv("TEAMSPEAK_URL", "https://teamspeak.com")
        self.discord = getenv("DISCORD_URL", "https://discord.com")
        self.matrix = getenv("MATRIX_URL", "https://matrix.org")

config = Config()