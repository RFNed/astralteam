from email.message import EmailMessage
from aiosmtplib import SMTP

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