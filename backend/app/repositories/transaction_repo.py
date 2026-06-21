from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.schemas import TransactionCreate, TransactionUpdate
from uuid import UUID

def get_all(db: Session, user_id: str):
    result = db.execute(
        text("SELECT * FROM transactions WHERE user_id = :uid ORDER BY date DESC"),
        {"uid": user_id}
    )
    return result.mappings().all()

def get_one(db: Session, transaction_id: UUID, user_id: str):
    result = db.execute(
        text("SELECT * FROM transactions WHERE id = :id AND user_id = :uid"),
        {"id": str(transaction_id), "uid": user_id}
    )
    return result.mappings().first()

def create(db: Session, data: TransactionCreate, user_id: str):
    result = db.execute(
        text("""
            INSERT INTO transactions (user_id, amount, type, category, date, description)
            VALUES (:uid, :amount, :type, :category, :date, :desc)
            RETURNING *
        """),
        {
            "uid": user_id,
            "amount": data.amount,
            "type": data.type,
            "category": data.category,
            "date": data.transaction_date,
            "desc": data.description
        }
    )
    db.commit()
    return result.mappings().first()

def update(db: Session, transaction_id: UUID, data: TransactionUpdate, user_id: str):
    existing = get_one(db, transaction_id, user_id)
    if not existing:
        return None
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if "transaction_date" in updates:
        updates["date"] = updates.pop("transaction_date")
    if not updates:
        return existing
    set_clause = ", ".join(f"{k} = :{k}" for k in updates)
    updates["id"] = str(transaction_id)
    updates["uid"] = user_id
    result = db.execute(
        text(f"UPDATE transactions SET {set_clause} WHERE id = :id AND user_id = :uid RETURNING *"),
        updates
    )
    db.commit()
    return result.mappings().first()

def delete(db: Session, transaction_id: UUID, user_id: str):
    result = db.execute(
        text("DELETE FROM transactions WHERE id = :id AND user_id = :uid RETURNING id"),
        {"id": str(transaction_id), "uid": user_id}
    )
    db.commit()
    return result.mappings().first()