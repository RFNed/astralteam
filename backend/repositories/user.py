class UserRepository:

    def __init__(self, db):
        self.db = db

    async def create_user(self, username: str, email: str, password_hash: str):
        query = """
            INSERT INTO users (username, email, password_hash) values (%s, %s, %s)
        """
        await self.db.execute(query, (username, email, password_hash,))
    async def check_account_exists(self, username: str, email: str):
        query = """
            SELECT 1 FROM users WHERE username = %s OR email = %s
        """
        await self.db.execute(query, (username, email,))
        result = await self.db.fetchone()
        return result is not None
    async def verify_user_email(self, email: str):
        query = """
            UPDATE users SET email_verify = 1 WHERE email = %s
        """
        await self.db.execute(query, (email,))