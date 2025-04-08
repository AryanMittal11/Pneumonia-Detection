from flask import Flask, request, render_template
import cv2
import numpy as np
import os
import pickle
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
import requests
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

load_dotenv()  # Load environment variables from .env file

# Load pre-trained model and label encoder
model = load_model('models/CNN_Xray_Version.h5')
le = pickle.load(open("models/Label_encoder.pkl", 'rb'))

# Supabase credentials (⚠️ don't expose these on frontend in production)
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Key: {SUPABASE_KEY}")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# File upload settings
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def process_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found at path: {image_path}")
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (150, 150))
    image_normalized = image_resized / 255.0
    image_input = np.expand_dims(image_normalized, axis=0)
    predictions = model.predict(image_input)
    predicted_index = np.argmax(predictions)
    confidence_score = predictions[0][predicted_index]
    predicted_label = le.inverse_transform([predicted_index])[0]
    return predicted_label, confidence_score

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {"error": "No file uploaded"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "Empty filename"}, 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            predicted_label, confidence_score = process_image(file_path)
        except Exception as e:
            return {"error": str(e)}, 500

        try:
            response = supabase.table("analyses").insert({
                "image_path": file_path,
                "predicted_label": predicted_label,
                "confidence_score": round(float(confidence_score), 4),
                # "timestamp": str(np.datetime64('now')),
                "status": "success"
            }).execute()

            if not response.data:
                return {
                    "error": "Supabase insert failed",
                    "response": str(response)
                }, 500


        except Exception as e:
            return {"error": f"Exception while inserting to Supabase: {str(e)}"}, 500

        return {
            "predicted_label": predicted_label,
            "confidence_score": round(float(confidence_score), 4)
        }

@app.route('/predict', methods=['POST'])
def predict_from_url():
    try:
        data = request.get_json()
        image_url = data.get('image_url')
        if not image_url:
            return {"error": "Image URL is required"}, 400

        response = requests.get(image_url)
        if response.status_code != 200:
            return {"error": "Unable to download image"}, 400

        image_array = np.frombuffer(response.content, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        if image is None:
            return {"error": "Invalid image data"}, 400

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_resized = cv2.resize(image_rgb, (150, 150))
        image_normalized = image_resized / 255.0
        image_input = np.expand_dims(image_normalized, axis=0)

        predictions = model.predict(image_input)
        predicted_index = np.argmax(predictions)
        confidence_score = float(predictions[0][predicted_index])
        predicted_label = le.inverse_transform([predicted_index])[0]

        return {
            "predicted_label": predicted_label,
            "probability": confidence_score
        }

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
