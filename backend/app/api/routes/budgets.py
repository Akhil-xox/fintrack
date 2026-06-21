from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.schemas import BudgetCreate
from app.repositories import budget_repo

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.get("/")
def list_budgets(
    month: int = date.today().month,
    year: int = date.today().year,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return budget_repo.get_all(db, user_id, month, year)

@router.post("/", status_code=201)
def upsert_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return budget_repo.create_or_update(db, data, user_id)

@router.delete("/{budget_id}", status_code=204)
def delete_budget(
    budget_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = budget_repo.delete(db, budget_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Budget not found")