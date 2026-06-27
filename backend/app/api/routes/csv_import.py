from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.csv_parser import parse_csv
from app.repositories import transaction_repo

router = APIRouter(prefix="/import", tags=["import"])

@router.post("/preview")
async def preview_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large — max 5MB")

    parsed = parse_csv(contents)
    if not parsed:
        raise HTTPException(status_code=400, detail="No transactions could be parsed from this file")

    # Check which ones are duplicates for the preview
    preview = []
    for tx in parsed:
        is_dup = transaction_repo.is_duplicate(db, user_id, tx["amount"], tx["date"], tx["description"])
        preview.append({ **tx, "is_duplicate": is_dup })

    return {
        "total": len(preview),
        "new": sum(1 for t in preview if not t["is_duplicate"]),
        "duplicates": sum(1 for t in preview if t["is_duplicate"]),
        "transactions": preview
    }

@router.post("/confirm")
async def confirm_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    contents = await file.read()
    parsed = parse_csv(contents)

    if not parsed:
        raise HTTPException(status_code=400, detail="No transactions could be parsed")

    result = transaction_repo.bulk_create(db, parsed, user_id)
    return result