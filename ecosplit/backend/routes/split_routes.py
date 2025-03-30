# backend/routes/split_routes.py
from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from utils.scorer import calculate_green_score
from firebase_config import get_db
from firebase_admin import firestore

split_bp = Blueprint('split', __name__)

@split_bp.route('/split', methods=['POST'])
def split_bill():
    data = request.get_json()
    user_data = data.get("users", {})  # {"Alice": [items], "Bob": [items]}
    receipt_id = data.get("receipt_id")
    group_name = data.get("group_name", f"Split {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    result = []
    total_bill = 0
    
    for user, items in user_data.items():
        score = calculate_green_score(items)
        total_spent = sum(item.get("price", 0) for item in items)
        total_bill += total_spent
        result.append({
            "user": user,
            "total_spent": round(total_spent, 2),
            "green_score": score,
            "items": items
        })

    # Store split data in Firebase
    try:
        db = get_db()
        split_id = str(uuid.uuid4())
        
        split_data = {
            'split_id': split_id,
            'receipt_id': receipt_id,
            'group_name': group_name,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'total_bill': round(total_bill, 2),
            'participants': result
        }
        
        # Save to Firestore
        db.collection('splits').document(split_id).set(split_data)
        
        # If receipt_id is provided, link this split to the receipt
        if receipt_id:
            db.collection('receipts').document(receipt_id).update({
                'split_id': split_id,
                'split_timestamp': firestore.SERVER_TIMESTAMP
            })
        
        # Add split_id to the result
        return jsonify({
            "split_id": split_id,
            "result": result
        })
    except Exception as e:
        # If there's an error with Firebase, still return the split result
        return jsonify({
            "status": "partial_success", 
            "message": f"Split calculated but not stored: {str(e)}",
            "result": result
        })

@split_bp.route('/splits', methods=['GET'])
def get_splits():
    """Get all splits"""
    try:
        db = get_db()
        splits_ref = db.collection('splits').order_by('timestamp', direction='DESCENDING')
        splits = [doc.to_dict() for doc in splits_ref.stream()]
        
        return jsonify({
            "status": "success",
            "splits": splits
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@split_bp.route('/splits/<split_id>', methods=['GET'])
def get_split(split_id):
    """Get a specific split by ID"""
    try:
        db = get_db()
        split_doc = db.collection('splits').document(split_id).get()
        
        if not split_doc.exists:
            return jsonify({"status": "error", "message": "Split not found"}), 404
            
        return jsonify({
            "status": "success",
            "split": split_doc.to_dict()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500