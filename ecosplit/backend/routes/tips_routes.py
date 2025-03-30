# backend/routes/tips_routes.py
from flask import Blueprint, request, jsonify
from openai import OpenAI
from config import OPENAI_API_KEY

tips_bp = Blueprint('tips', __name__)
client = OpenAI(api_key=OPENAI_API_KEY)

@tips_bp.route('/suggestions', methods=['POST'])
def get_suggestions():
    data = request.get_json()
    items = data.get("items", [])
    item_names = ", ".join(item['name'] for item in items)

    prompt = (
        f"I recently purchased these items: {item_names}. "
        "Give me a short suggestion on how to make more eco-friendly choices next time."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=100
        )
        suggestion = response.choices[0].message.content.strip()
        return jsonify({"suggestion": suggestion})
    except Exception as e:
        return jsonify({"error": str(e)}), 500