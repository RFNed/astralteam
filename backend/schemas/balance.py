from pydantic import BaseModel
from decimal import Decimal
from typing import Literal
from datetime import datetime

class YooMoneyNotification(BaseModel):
    notification_type: str

    bill_id: str | None = None

    amount: Decimal

    datetime: datetime

    codepro: bool
    sender: str

    test_notification: bool | None = None

    operation_label: str | None = None

    sign: str

    operation_id: str

    currency: str

    label: str | None = None