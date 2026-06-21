from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
def monthly_summary(
    month: int = date.today().month,
    year: int = date.today().year,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expenses
        FROM transactions
        WHERE user_id = :uid
          AND EXTRACT(MONTH FROM date) = :month
          AND EXTRACT(YEAR  FROM date) = :year
    """), {"uid": user_id, "month": month, "year": year})
    row = result.mappings().first()
    if not row:
        return {"total_income": 0, "total_expenses": 0, "net": 0}
    return {
        "total_income":   float(row["total_income"]),
        "total_expenses": float(row["total_expenses"]),
        "net":            float(row["total_income"]) - float(row["total_expenses"])
    }

@router.get("/by-category")
def spend_by_category(
    month: int = date.today().month,
    year: int = date.today().year,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT category, SUM(amount) AS total
        FROM transactions
        WHERE user_id = :uid
          AND type = 'expense'
          AND EXTRACT(MONTH FROM date) = :month
          AND EXTRACT(YEAR  FROM date) = :year
        GROUP BY category
        ORDER BY total DESC
    """), {"uid": user_id, "month": month, "year": year})
    return [{"category": r["category"], "total": float(r["total"])}
            for r in result.mappings().all()]

@router.get("/monthly-trend")
def monthly_trend(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            EXTRACT(YEAR  FROM date) AS year,
            EXTRACT(MONTH FROM date) AS month,
            SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
        FROM transactions
        WHERE user_id = :uid
          AND date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY year, month
        ORDER BY year, month
    """), {"uid": user_id})
    return [
        {
            "year":     int(r["year"]),
            "month":    int(r["month"]),
            "income":   float(r["income"]),
            "expenses": float(r["expenses"])
        }
        for r in result.mappings().all()
    ]