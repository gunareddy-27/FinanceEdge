import pandas as pd
from pathlib import Path

def load_transactions(csv_path: str | Path) -> pd.DataFrame:
    """Load transaction data from a CSV file.
    Expected columns: id, description, amount, date, type, category (optional), transport_start, transport_end, transport_price
    """
    df = pd.read_csv(csv_path)
    # Ensure proper types
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    return df
