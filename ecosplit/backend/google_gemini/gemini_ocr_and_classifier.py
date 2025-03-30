from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai

def process_receipt_with_gemini(project_id, image_path):
    vertexai.init(project=project_id, location="us-central1")
    model = GenerativeModel("gemini-pro-vision")

    # Load image properly
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    image_part = Part.from_data(data=image_bytes, mime_type="image/jpeg")

    # Prompt Gemini
    prompt = (
        "Extract the list of items from this receipt. For each item, classify it as eco-friendly or not eco-friendly, "
        "assign an eco_score from 0 to 1, and format the output as a JSON array like:\n"
        "[{\"name\": \"Item\", \"price\": 2.99, \"eco_label\": \"Eco\", \"eco_score\": 0.85}]"
    )

    response = model.generate_content([prompt, image_part])
    return response.text