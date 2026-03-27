import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_synthetic_data(num_rows=1000):
    merchants = {
        'Food': ['Swiggy', 'Zomato', 'Starbucks', 'McDonalds', 'Blinkit', 'Restaurant', 'Cafe'],
        'Transport': ['Uber', 'Ola', 'Rapido', 'Indigo', 'Fuel', 'Metro'],
        'Shopping': ['Amazon', 'Flipkart', 'Myntra', 'Zara', 'Apple', 'Samsung'],
        'Software': ['AWS', 'Google Cloud', 'OpenAI', 'Github', 'Notion', 'Microsoft'],
        'Bills': ['Electricity', 'Water', 'Jio', 'Airtel', 'Rent', 'Maintenance'],
        'Entertainment': ['Netflix', 'Spotify', 'YouTube', 'Movie', 'BookMyShow', 'Gaming'],
        'Health': ['Apollo', 'Pharmacy', 'Medplus', 'Gym', 'Fitness', 'Cult']
    }
    
    categories = list(merchants.keys())
    data = []
    
    for i in range(num_rows):
        cat = random.choice(categories)
        merchant = random.choice(merchants[cat])
        amount = random.uniform(50, 1500) if cat in ['Food', 'Transport'] else random.uniform(500, 50000)
        
        # Add some outliers for fraud detection
        if random.random() < 0.02:
            amount *= 10
            
        date = datetime.now() - timedelta(days=random.randint(1, 400))
        is_weekend = date.weekday() >= 5
        
        data.append({
            'transaction_id': f'TXN_{i:04d}',
            'user_id': f'USER_{random.randint(1, 5)}',
            'date': date.strftime('%Y-%m-%d'),
            'amount': round(amount, 2),
            'currency': 'INR',
            'merchant': merchant,
            'description': f'{merchant} transaction for {cat.lower()}',
            'main_category': cat,
            'sub_category': 'General',
            'is_weekend': is_weekend
        })
        
    df = pd.DataFrame(data)
    df.to_csv('dataset_structure.csv', index=False)
    print(f"Generated {num_rows} rows of synthetic data in dataset_structure.csv")

if __name__ == "__main__":
    generate_synthetic_data()
