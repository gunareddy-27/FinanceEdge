import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

class Preprocessor:
    """Preprocess transaction descriptions for model training.
    - Lowercases text
    - Removes non‑alphanumeric characters
    - Applies TF‑IDF vectorization
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)

    def clean_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def fit_transform(self, texts: pd.Series):
        cleaned = texts.apply(self.clean_text)
        return self.vectorizer.fit_transform(cleaned)

    def transform(self, texts: pd.Series):
        cleaned = texts.apply(self.clean_text)
        return self.vectorizer.transform(cleaned)
