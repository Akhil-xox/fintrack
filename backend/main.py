from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import transactions, budgets, analytics, csv_import

app = FastAPI(title="FinTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(analytics.router)
app.include_router(csv_import.router)

@app.get("/health")
def health():
    return {"status": "ok"}

# ok