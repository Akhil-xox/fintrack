from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional
from uuid import UUID

# ── Transactions ──────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    amount: float
    type: str  # 'income' or 'expense'
    category: str
    transaction_date: date
    description: Optional[str] = None

    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        if v not in ('income', 'expense'):
            raise ValueError("type must be 'income' or 'expense'")
        return v

    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("amount must be positive")
        return v

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    transaction_date: Optional[date] = None
    description: Optional[str] = None

class TransactionOut(BaseModel):
    id: UUID
    user_id: UUID
    amount: float
    type: str
    category: str
    transaction_date: date
    description: Optional[str]
    source: str

    class Config:
        from_attributes = True

# ── Budgets ───────────────────────────────────────────────────────────────────

class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: int
    year: int

    @field_validator('month')
    @classmethod
    def validate_month(cls, v):
        if not 1 <= v <= 12:
            raise ValueError("month must be between 1 and 12")
        return v

    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("amount must be positive")
        return v

class BudgetOut(BaseModel):
    id: UUID
    user_id: UUID
    category: str
    amount: float
    month: int
    year: int

    class Config:
        from_attributes = True