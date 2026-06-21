from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.schemas import BudgetCreate
from uuid import UUID

def get_all(db: Session, user_id: str, month: int, year: int):
    result = db.execute(
        text("""
            SELECT * FROM budgets
            WHERE user_id = :uid AND month = :month AND year = :year
        """),
        {"uid": user_id, "month": month, "year": year}
    )
    return result.mappings().all()

def create_or_update(db: Session, data: BudgetCreate, user_id: str):
    result = db.execute(
        text("""
            INSERT INTO budgets (user_id, category, amount, month, year)
            VALUES (:uid, :category, :amount, :month, :year)
            ON CONFLICT (user_id, category, month, year)
            DO UPDATE SET amount = EXCLUDED.amount
            RETURNING *
        """),
        {
            "uid": user_id,
            "category": data.category,
            "amount": data.amount,
            "month": data.month,
            "year": data.year
        }
    )
    db.commit()
    return result.mappings().first()

def delete(db: Session, budget_id: UUID, user_id: str):
    result = db.execute(
        text("DELETE FROM budgets WHERE id = :id AND user_id = :uid RETURNING id"),
        {"id": str(budget_id), "uid": user_id}
    )
    db.commit()
    return result.mappings().first()