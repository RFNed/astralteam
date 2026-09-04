import aiofiles
from backend.core.config import settings
from email.message import EmailMessage
from aiosmtplib import SMTP

FRONTEND_URL = settings.FRONTEND_URL

async def parse_template(template_html: str, image_path: str, link: str) -> str:
    async with aiofiles.open(template_html, "r") as template_email:
        content = await template_email.read()
        content = content.replace("{{image_path}}", image_path).replace("{{link}}", link)
        return content

class EmailService:
    def __init__(self, hostname: str, port: int, username: str, password: str):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password

    async def send(self, to: str, subject: str, simple_content: str, HTML_content: str):
        message = EmailMessage()
        message["From"] = self.username
        message["To"] = to

        message["Subject"] = subject

        message.set_content(simple_content)
        message.add_alternative(HTML_content, subtype="html")

        async with SMTP(
            hostname=self.hostname,
            port=self.port,
            start_tls=True
        ) as smtp:
            await smtp.login(
                self.username,
                self.password
            )

            await smtp.send_message(message)
            
    async def send_verification_email(self, to: str, token: str):
            html_content = await parse_template(
                        template_html="backend/resource/email/template_mail.html",
                        image_path=("https://raw.githubusercontent.com/RFNed/astralteam/main/Frontend/public/pics/astralcat.png"),link=(f"{FRONTEND_URL}/registration/verify/{token}"))
            await self.send(
                to=to,
                subject="Verify your email",
                simple_content="Подтверждение аккаунта",
                HTML_content=html_content,
            )