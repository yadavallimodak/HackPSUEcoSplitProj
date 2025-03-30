# backend/utils/scorer.py
def calculate_green_score(items):
    if not items:
        return 0.0
    
    # Default value of 1.0 for items without eco_score
    total_score = sum(item.get('eco_score', 1.0) for item in items)
    return round(total_score / len(items), 2)