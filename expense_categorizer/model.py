import joblib
import pandas as pd
from pathlib import Path
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression

class ModelHandler:
    """Wrapper for training and inference of expense categorization models.
    Supports Naive Bayes and Logistic Regression (multiclass).
    """
    def __init__(self, model_type: str = "naive_bayes"):
        if model_type not in {"naive_bayes", "logistic_regression"}:
            raise ValueError("model_type must be 'naive_bayes' or 'logistic_regression'")
        self.model_type = model_type
        self.model = None

    def train(self, X, y):
        if self.model_type == "naive_bayes":
            self.model = MultinomialNB()
        else:
            self.model = LogisticRegression(max_iter=1000, n_jobs=-1)
        self.model.fit(X, y)
        return self.model

    def predict(self, X):
        if self.model is None:
            raise RuntimeError("Model has not been trained or loaded.")
        return self.model.predict(X)

    def save(self, path: str | Path):
        joblib.dump({"model": self.model, "type": self.model_type}, path)

    @staticmethod
    def load(path: str | Path):
        data = joblib.load(path)
        handler = ModelHandler(model_type=data["type"])
        handler.model = data["model"]
        return handler
