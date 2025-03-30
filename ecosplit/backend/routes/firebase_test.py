# backend/routes/firebase_test.py
from flask import Blueprint, jsonify
from firebase_config import get_db
from firebase_admin import firestore
import datetime

test_bp = Blueprint('test', __name__)

@test_bp.route('/firebase-test', methods=['GET'])
def test_firebase():
    """Test Firebase connection by writing and reading a document"""
    try:
        db = get_db()
        test_collection = db.collection('test')
        
        # Create a test document
        doc_id = f"test-{datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}"
        test_data = {
            'timestamp': firestore.SERVER_TIMESTAMP,
            'message': 'Firebase connection test successful',
            'test_id': doc_id
        }
        
        # Write to Firestore
        test_collection.document(doc_id).set(test_data)
        
        # Read back from Firestore
        doc = test_collection.document(doc_id).get()
        
        if doc.exists:
            return jsonify({
                'status': 'success',
                'message': 'Firebase connection is working',
                'data': doc.to_dict()
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Document was written but could not be read back'
            }), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Firebase connection test failed: {str(e)}'
        }), 500 