from flask import Blueprint, request, jsonify
import os
import json
import uuid
from datetime import datetime
from google_gemini.gemini_ocr_and_classifier import process_receipt_with_gemini
from config import GCP_PROJECT_ID
from firebase_config import get_db
from firebase_admin import firestore

ocr_bp = Blueprint('ocr', __name__)

@ocr_bp.route('/ocr-gemini', methods=['POST'])
def gemini_ocr():
    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No image provided'}), 400

    temp_path = os.path.join("static", file.filename)
    file.save(temp_path)

    try:
        output = process_receipt_with_gemini(GCP_PROJECT_ID, temp_path)
        parsed_output = json.loads(output)
        
        # Store receipt data in Firebase
        db = get_db()
        receipt_id = str(uuid.uuid4())
        
        # Get metadata from request if available
        user_id = request.form.get('user_id', 'anonymous')
        receipt_name = request.form.get('receipt_name', f'Receipt {datetime.now().strftime("%Y-%m-%d %H:%M")}')
        
        receipt_data = {
            'receipt_id': receipt_id,
            'user_id': user_id,
            'receipt_name': receipt_name,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'items': parsed_output,
            'total': sum(item.get('price', 0) for item in parsed_output),
            'image_path': temp_path
        }
        
        # Save to Firestore
        db.collection('receipts').document(receipt_id).set(receipt_data)
        
        # Return the receipt data with its ID
        return jsonify({
            "status": "success", 
            "receipt_id": receipt_id,
            "items": parsed_output
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@ocr_bp.route('/receipts', methods=['GET'])
def get_receipts():
    """Get all receipts for a user"""
    user_id = request.args.get('user_id', 'anonymous')
    
    try:
        db = get_db()
        receipts_ref = db.collection('receipts').where('user_id', '==', user_id).order_by('timestamp', direction='DESCENDING')
        receipts = [doc.to_dict() for doc in receipts_ref.stream()]
        
        return jsonify({
            "status": "success",
            "receipts": receipts
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@ocr_bp.route('/receipts/<receipt_id>', methods=['GET'])
def get_receipt(receipt_id):
    """Get a specific receipt by ID"""
    try:
        db = get_db()
        receipt_doc = db.collection('receipts').document(receipt_id).get()
        
        if not receipt_doc.exists:
            return jsonify({"status": "error", "message": "Receipt not found"}), 404
            
        return jsonify({
            "status": "success",
            "receipt": receipt_doc.to_dict()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500