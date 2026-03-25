import pandas as pd
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_csv(csv_path: str | Path) -> pd.DataFrame:
    """Load a CSV file into a DataFrame with basic validation."""
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded {len(df)} rows from {csv_path}")
    return df

def save_pickle(obj, path: str | Path):
    import joblib
    joblib.dump(obj, path)
    logger.info(f"Saved object to {path}")

def load_pickle(path: str | Path):
    import joblib
    obj = joblib.load(path)
    logger.info(f"Loaded object from {path}")
    return obj
