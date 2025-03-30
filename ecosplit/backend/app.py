# backend/app.py
from flask import Flask
from flask_cors import CORS
from routes.ocr_routes import ocr_bp
from routes.split_routes import split_bp
from routes.tips_routes import tips_bp
from routes.user_routes import user_bp
from routes.firebase_test import test_bp
from firebase_config import initialize_firebase

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable cross-origin for frontend
    
    # Initialize Firebase connection
    initialize_firebase()

    # Register route Blueprints
    app.register_blueprint(ocr_bp, url_prefix='/api')
    app.register_blueprint(split_bp, url_prefix='/api')
    app.register_blueprint(tips_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(test_bp, url_prefix='/api')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)