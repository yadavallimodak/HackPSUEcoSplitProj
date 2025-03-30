import requests
import json
import datetime

BASE_URL = "http://127.0.0.1:5000/api"

def test_ocr_gemini():
    image_name = input("🖼️ Enter the name of the receipt image (inside static/): ").strip()
    file_path = f"static/{image_name}"

    try:
        with open(file_path, "rb") as img_file:
            files = {"image": img_file}
            response = requests.post(f"{BASE_URL}/ocr-gemini", files=files)
            ocr_data = response.json()
            return ocr_data
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return {"status": "error", "message": "Image file not found"}

def test_suggestion(items):
    payload = {"items": items}
    response = requests.post(f"{BASE_URL}/suggestions", json=payload)
    suggestion_data = response.json()
    return suggestion_data.get("suggestion", "No suggestion returned.")


def assign_badge(score):
    if score >= 90:
        return "🏆 Eco Legend"
    elif score >= 80:
        return "🌟 Eco Hero"
    elif score >= 60:
        return "✅ Sustainability Starter"
    elif score >= 30:
        return "⚠️ Needs Work"
    else:
        return "❌ Planet Polluter"


def calculate_green_score(items):
    if not items:
        return 0
    return round(sum(item['eco_score'] for item in items) / len(items) * 100, 2)

def test_split(items):
    # Optional: Attach percentage score to each item
    for item in items:
        item['eco_score_percent'] = round(item['eco_score'] * 100, 2)

    # Dummy even split
    mid = len(items) // 2
    apoorv_items = items[:mid]
    aarya_items = items[mid:]

    payload = {
        "users": {
            "Apoorv": apoorv_items,
            "Aarya": aarya_items
        }
    }

    response = requests.post(f"{BASE_URL}/split", json=payload)
    split_data = response.json()

    # Add individual green impact score (0-100) to each user in the response
    for user_data in split_data:
        user_items = payload["users"][user_data['user']]
        user_score = calculate_green_score(user_items)
        user_data["green_impact_score"] = user_score
        user_data["badge"] = assign_badge(user_score)

    return split_data

def save_full_session(data, filename=None):
    if not filename:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"../data/full_output_{timestamp}.json"
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)
    print(f"✅ Saved full session to {filename}")

if __name__ == "__main__":
    # 1. OCR + Classification
    ocr_response = test_ocr_gemini()

    if ocr_response.get("status") == "success":
        items = ocr_response["items"]
        overall_score = calculate_green_score(items)

        # 2. GPT Suggestion
        suggestion = test_suggestion(items)

        # 3. Smart Split
        split_result = test_split(items)

        # 4. Save everything
        full_output = {
            "items": items,
            "overall_green_impact_score": overall_score,
            "suggestion": suggestion,
            "split_summary": split_result
        }

        save_full_session(full_output)
    else:
        print("❌ OCR failed:", ocr_response.get("message"))
