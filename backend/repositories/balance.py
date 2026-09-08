class BalanceRepository:

    def __init__(self, db):
        self.db = db

    async def has_user_payment(self, id_user: str):
        query = """
            SELECT 1 FROM payments 
            WHERE id_user = %s and status IN ('pending', 'waiting_for_capture')
            LIMIT 1
        """
        await self.db.execute(query, (id_user,))
        result = await self.db.fetchone() is not None
        return result

    async def register_user_payment(self, id_user: str, payment_id: str, amount: str):
        query = """
            INSERT INTO payments (payment_id, amount, id_user) values (%s, %s, %s)
        """
        await self.db.execute(query, (payment_id, amount, id_user,))
        