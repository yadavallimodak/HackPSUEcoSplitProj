# backend/routes/user_routes.py
from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from firebase_config import get_db
from firebase_admin import firestore

user_bp = Blueprint('user', __name__)

@user_bp.route('/user', methods=['POST'])
def create_user():
    """Create a new user or update existing user"""
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    
    if not name or not email:
        return jsonify({
            "status": "error", 
            "message": "Name and email are required"
        }), 400
    
    try:
        db = get_db()
        
        # Check if user with this email already exists
        users_ref = db.collection('users').where('email', '==', email).limit(1)
        existing_users = list(users_ref.stream())
        
        if existing_users:
            # Update existing user
            user_id = existing_users[0].id
            user_data = {
                'name': name,
                'email': email,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            db.collection('users').document(user_id).update(user_data)
        else:
            # Create new user
            user_id = str(uuid.uuid4())
            user_data = {
                'user_id': user_id,
                'name': name,
                'email': email,
                'created_at': firestore.SERVER_TIMESTAMP,
                'updated_at': firestore.SERVER_TIMESTAMP,
                'eco_points': 0,
                'total_receipts': 0,
                'total_splits': 0
            }
            db.collection('users').document(user_id).set(user_data)
        
        # Get the updated user data
        user_doc = db.collection('users').document(user_id).get()
        
        return jsonify({
            "status": "success",
            "user": user_doc.to_dict()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@user_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get a user by ID"""
    try:
        db = get_db()
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
            
        # Get user's receipts
        receipts_ref = db.collection('receipts').where('user_id', '==', user_id).order_by('timestamp', direction='DESCENDING')
        receipts = [doc.to_dict() for doc in receipts_ref.stream()]
        
        # Get user's splits
        splits_ref = db.collection('splits').where('participants.user', 'array-contains', user_id).order_by('timestamp', direction='DESCENDING')
        splits = [doc.to_dict() for doc in splits_ref.stream()]
        
        return jsonify({
            "status": "success",
            "user": user_doc.to_dict(),
            "receipts": receipts,
            "splits": splits
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@user_bp.route('/user/email/<email>', methods=['GET'])
def get_user_by_email(email):
    """Get a user by email"""
    try:
        db = get_db()
        users_ref = db.collection('users').where('email', '==', email).limit(1)
        users = list(users_ref.stream())
        
        if not users:
            return jsonify({"status": "error", "message": "User not found"}), 404
            
        user_data = users[0].to_dict()
        
        return jsonify({
            "status": "success",
            "user": user_data
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@user_bp.route('/user/update-points', methods=['POST'])
def update_eco_points():
    """Update a user's eco points based on their green score"""
    data = request.get_json()
    user_id = data.get('user_id')
    green_score = data.get('green_score', 0)
    
    if not user_id:
        return jsonify({
            "status": "error", 
            "message": "User ID is required"
        }), 400
    
    try:
        db = get_db()
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        # Calculate points to add (1 point per 0.1 green score)
        points_to_add = int(green_score * 10)
        
        # Update user's eco points
        current_points = user_doc.to_dict().get('eco_points', 0)
        new_points = current_points + points_to_add
        
        user_ref.update({
            'eco_points': new_points,
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            "status": "success",
            "previous_points": current_points,
            "points_added": points_to_add,
            "new_points": new_points
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500 