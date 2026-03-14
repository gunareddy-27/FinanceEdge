import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor, IsolationForest
import pickle
import joblib

def train_categorization_model():
    """ 1. Intelligent Expense Categorization (NLP Model) """
    print("Training NLP Categorization Model...")
    df = pd.read_csv('dataset_structure.csv')
    
    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(df['description'])
    y = df['main_category']
    
    # Simple Naive Bayes
    model = MultinomialNB()
    model.fit(X, y)
    
    with open('nlp_categorizer.pkl', 'wb') as f:
        pickle.dump((vectorizer, model), f)
    print("NLP Model trained and saved.")

def train_spending_clustering():
    """ 2. Personalized Spending Behavior Analysis (K-Means) """
    print("Training Behavioral Clusters...")
    df = pd.read_csv('dataset_structure.csv')
    
    # Features: Average transaction amount, Weekend ratio
    user_data = df.groupby('user_id').agg(
        avg_transaction=('amount', 'mean'),
        weekend_ratio=('is_weekend', 'mean')
    ).reset_index()
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(user_data[['avg_transaction', 'weekend_ratio']])
    
    joblib.dump(kmeans, 'spending_clusters.pkl')
    print("K-Means Clustering model saved.")

def train_fraud_detection():
    """ 5. Fraudulent Transaction Detection (Isolation Forest) """
    print("Training Anomaly Detection Model...")
    df = pd.read_csv('dataset_structure.csv')
    
    # Detect outliers entirely on 'amount' for simple isolation
    iso_forest = IsolationForest(contamination=0.01, random_state=42)
    iso_forest.fit(df[['amount']])
    
    joblib.dump(iso_forest, 'fraud_isolation_forest.pkl')
    print("Isolation Forest trained and saved.")

if __name__ == "__main__":
    print("--- Starting AI FinanceEdge Research Pipeline ---")
    train_categorization_model()
    train_spending_clustering()
    train_fraud_detection()
    print("--- Pipeline Complete. Run app.py to start FastApi Server ---")
