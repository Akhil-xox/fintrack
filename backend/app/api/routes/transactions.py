from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.schemas import TransactionCreate, TransactionUpdate
from app.repositories import transaction_repo

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/")
def list_transactions(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return transaction_repo.get_all(db, user_id)

@router.post("/", status_code=201)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return transaction_repo.create(db, data, user_id)

@router.patch("/{transaction_id}")
def update_transaction(
    transaction_id: UUID,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = transaction_repo.update(db, transaction_id, data, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result

@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    result = transaction_repo.delete(db, transaction_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")