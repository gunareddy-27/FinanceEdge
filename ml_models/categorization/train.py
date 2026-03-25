import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from ml_models.utils import load_csv, save_pickle
import logging

logger = logging.getLogger(__name__)

def train_model(csv_path: str | Path, model_type: str = "logistic_regression"):
    """Train a transaction categorization model.
    Args:
        csv_path: Path to CSV containing at least 'description' and 'category' columns.
        model_type: 'logistic_regression' or 'naive_bayes'.
    Returns:
        Trained model and fitted TF‑IDF vectorizer.
    """
    df = load_csv(csv_path)
    if 'description' not in df.columns or 'category' not in df.columns:
        raise ValueError("CSV must contain 'description' and 'category' columns")
    texts = df['description'].astype(str)
    labels = df['category']
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X = vectorizer.fit_transform(texts)
    if model_type == "logistic_regression":
        model = LogisticRegression(max_iter=1000, n_jobs=-1)
    elif model_type == "naive_bayes":
        model = MultinomialNB()
    else:
        raise ValueError("Unsupported model_type")
    model.fit(X, labels)
    logger.info(f"Trained {model_type} model on {len(df)} records")
    return model, vectorizer

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train categorization model")
    parser.add_argument("--data", required=True, help="Path to training CSV")
    parser.add_argument("--model", default="logistic_regression", choices=["logistic_regression", "naive_bayes"], help="Model type")
    parser.add_argument("--output", default="categorization_model.pkl", help="File to save the trained model")
    args = parser.parse_args()
    model, vec = train_model(args.data, args.model)
    save_pickle({"model": model, "vectorizer": vec, "type": args.model}, args.output)
    logger.info(f"Model saved to {args.output}")
