import csv
import io
from datetime import datetime
from typing import Optional

CATEGORY_RULES = {
    "Food":          ["swiggy", "zomato", "restaurant", "cafe", "food", "hotel", "pizza", "burger"],
    "Transport":     ["uber", "ola", "rapido", "petrol", "fuel", "irctc", "railway", "metro", "bus"],
    "Shopping":      ["amazon", "flipkart", "myntra", "meesho", "mall", "store"],
    "Utilities":     ["electricity", "water", "gas", "broadband", "airtel", "jio", "bsnl", "recharge"],
    "Health":        ["pharmacy", "hospital", "clinic", "doctor", "medplus", "apollo"],
    "Entertainment": ["netflix", "spotify", "prime", "hotstar", "bookmyshow", "movie"],
    "Housing":       ["rent", "maintenance", "society", "flat"],
    "Salary":        ["salary", "neft", "credited", "payroll"],
}

def auto_categorize(description: str) -> str:
    desc_lower = description.lower()
    for category, keywords in CATEGORY_RULES.items():
        if any(kw in desc_lower for kw in keywords):
            return category
    return "Other"

def clean_amount(value: str) -> Optional[float]:
    if not value or not value.strip():
        return None
    # Remove rupee symbol, commas, spaces
    cleaned = value.replace("₹", "").replace(",", "").replace(" ", "").strip()
    try:
        amount = float(cleaned)
        return amount if amount > 0 else None
    except ValueError:
        return None

def parse_date(date_str: str) -> Optional[str]:
    date_str = date_str.strip()
    formats = [
        "%d/%m/%Y",     # HDFC: 22/06/2026
        "%d %b %Y",     # SBI: 22 Jun 2026
        "%d-%m-%Y",     # alternate
        "%Y-%m-%d",     # ISO
        "%d/%m/%y",     # short year
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

def detect_bank(headers: list[str]) -> str:
    headers_lower = [h.lower().strip() for h in headers]
    if any("narration" in h for h in headers_lower):
        return "hdfc"
    if any("txn date" in h or "description" in h for h in headers_lower):
        return "sbi"
    return "unknown"

def parse_hdfc(reader, headers: list[str]) -> list[dict]:
    transactions = []
    for row in reader:
        if len(row) < 6:
            continue
        date_str  = row[0].strip()
        narration = row[1].strip()
        withdrawal = clean_amount(row[4]) if len(row) > 4 else None
        deposit    = clean_amount(row[5]) if len(row) > 5 else None

        parsed_date = parse_date(date_str)
        if not parsed_date or not narration:
            continue

        if withdrawal:
            transactions.append({
                "date": parsed_date,
                "description": narration,
                "amount": withdrawal,
                "type": "expense",
                "category": auto_categorize(narration),
            })
        if deposit:
            transactions.append({
                "date": parsed_date,
                "description": narration,
                "amount": deposit,
                "type": "income",
                "category": auto_categorize(narration),
            })
    return transactions

def parse_sbi(reader, headers: list[str]) -> list[dict]:
    transactions = []
    for row in reader:
        if len(row) < 5:
            continue
        date_str    = row[0].strip()
        description = row[1].strip()
        debit       = clean_amount(row[3]) if len(row) > 3 else None
        credit      = clean_amount(row[4]) if len(row) > 4 else None

        parsed_date = parse_date(date_str)
        if not parsed_date or not description:
            continue

        if debit:
            transactions.append({
                "date": parsed_date,
                "description": description,
                "amount": debit,
                "type": "expense",
                "category": auto_categorize(description),
            })
        if credit:
            transactions.append({
                "date": parsed_date,
                "description": description,
                "amount": credit,
                "type": "income",
                "category": auto_categorize(description),
            })
    return transactions

def parse_csv(file_bytes: bytes) -> list[dict]:
    # Try UTF-8 first, fall back to latin-1 for older bank exports
    try:
        content = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        content = file_bytes.decode("latin-1")

    reader = csv.reader(io.StringIO(content))
    rows = list(reader)

    if not rows:
        return []

    # Find the header row — skip any bank metadata rows at the top
    header_idx = 0
    for i, row in enumerate(rows):
        if any(cell.strip() for cell in row):
            header_idx = i
            break

    headers = rows[header_idx]
    bank = detect_bank(headers)

    data_reader = iter(rows[header_idx + 1:])

    if bank == "hdfc":
        return parse_hdfc(data_reader, headers)
    elif bank == "sbi":
        return parse_sbi(data_reader, headers)
    else:
        # Generic fallback — try to find date, description, amount columns
        return parse_generic(rows[header_idx + 1:], headers)

def parse_generic(rows: list, headers: list[str]) -> list[dict]:
    """Fallback parser for unknown bank formats."""
    transactions = []
    headers_lower = [h.lower().strip() for h in headers]

    # Try to find column indices
    date_idx   = next((i for i, h in enumerate(headers_lower) if "date" in h), None)
    desc_idx   = next((i for i, h in enumerate(headers_lower) if any(k in h for k in ["desc", "narr", "particular", "detail"])), None)
    debit_idx  = next((i for i, h in enumerate(headers_lower) if any(k in h for k in ["debit", "withdrawal", "dr"])), None)
    credit_idx = next((i for i, h in enumerate(headers_lower) if any(k in h for k in ["credit", "deposit", "cr"])), None)
    amount_idx = next((i for i, h in enumerate(headers_lower) if h == "amount"), None)

    if date_idx is None or desc_idx is None:
        return []

    for row in rows:
        if len(row) <= max(filter(None, [date_idx, desc_idx, debit_idx, credit_idx, amount_idx]), default=0):
            continue

        parsed_date = parse_date(row[date_idx])
        description = row[desc_idx].strip()
        if not parsed_date or not description:
            continue

        if debit_idx and credit_idx:
            debit  = clean_amount(row[debit_idx])
            credit = clean_amount(row[credit_idx])
            if debit:
                transactions.append({"date": parsed_date, "description": description, "amount": debit, "type": "expense", "category": auto_categorize(description)})
            if credit:
                transactions.append({"date": parsed_date, "description": description, "amount": credit, "type": "income", "category": auto_categorize(description)})
        elif amount_idx:
            amount = clean_amount(row[amount_idx])
            if amount:
                transactions.append({"date": parsed_date, "description": description, "amount": amount, "type": "expense", "category": auto_categorize(description)})

    return transactions