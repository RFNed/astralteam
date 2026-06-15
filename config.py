from dotenv import load_dotenv
from os import getenv

load_dotenv()

class Config:
    def __init__(self):
        self.frontend_url = getenv("WEBSITE_URL")
        self.is_debug = getenv("IS_DEBUG", "False")
        self.github = getenv("GITHUB_LINK", "https://github.com")

config = Config()