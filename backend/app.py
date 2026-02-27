import os
import json
import time
import docx
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from dotenv import load_dotenv

from google import genai
from google.genai import types

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- GEMINI SETUP ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

client = genai.Client(api_key=api_key)

# Models to try in order (Lite is faster/cheaper)
MODEL_CANDIDATES = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
]

# --- HELPERS ---
def extract_text_from_pdf(file_storage):
    try:
        reader = PdfReader(file_storage)
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return "\n".join(text_parts).strip()
    except Exception as e:
        print(f"PDF Error: {e}")
        return None

def extract_text_from_docx(file_storage):
    try:
        doc = docx.Document(file_storage)
        full_text = [para.text for para in doc.paragraphs]
        return "\n".join(full_text).strip()
    except Exception as e:
        print(f"DOCX Error: {e}")
        return None

@app.route("/api/analyze", methods=["POST"])
def analyze_resume():
    print("--- Analysis Request Received ---")

    # 1. Validation
    job_role = request.form.get("job_role", "").strip()
    if not job_role:
        return jsonify({"error": "Missing job_role"}), 400

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename.lower()

    # 2. Text Extraction
    if filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(file)
    elif filename.endswith(".docx"):
        resume_text = extract_text_from_docx(file)
    else:
        return jsonify({"error": "Invalid format. Upload PDF or DOCX."}), 400

    if not resume_text:
        return jsonify({"error": "Could not read text from file."}), 400

    # Limit text length for speed
    resume_excerpt = resume_text[:2500]

    # 3. The Prompt (Requests Learning Path)
    prompt = f"""
    You are an expert technical career coach.
    Analyze this resume for the target role: {job_role}.

    Task:
    1. Evaluate match score (0-100).
    2. Identify strengths and critical skill gaps.
    3. Recommend 3 specific online courses/resources to bridge the gaps.

    Resume Text:
    {resume_excerpt}

    Return ONLY a JSON object with this exact structure (no markdown):
    {{
      "score": <0-100>,
      "feedback_text": "One concise paragraph of professional career advice.",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "gaps": ["Gap 1", "Gap 2", "Gap 3"],
      "action_steps": ["Action 1", "Action 2", "Action 3"],
      "learning_path": [
        {{
          "skill": "Missing Skill Name",
          "course_name": "Specific Course Title (e.g. 'Complete Python Bootcamp')",
          "platform": "Platform Name (e.g. Udemy, Coursera, YouTube)",
          "description": "Short reason why this helps."
        }},
        {{
          "skill": "Missing Skill 2",
          "course_name": "Course Title 2",
          "platform": "Platform 2",
          "description": "Reason 2."
        }},
        {{
          "skill": "Missing Skill 3",
          "course_name": "Course Title 3",
          "platform": "Platform 3",
          "description": "Reason 3."
        }}
      ]
    }}
    """.strip()

    # 4. Call Gemini (With Retry Logic)
    response = None
    last_err = None

    for model_name in MODEL_CANDIDATES:
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.3,
                    ),
                )
                last_err = None
                print(f"Success with model: {model_name}")
                break
            except Exception as e:
                last_err = e
                if "503" in str(e) or "overloaded" in str(e).lower():
                    time.sleep(1.5 * (attempt + 1))
                    continue
                if "404" in str(e):
                    break
                raise
        if last_err is None and response is not None:
            break

    if last_err is not None or response is None:
        return jsonify({"error": "AI Service Busy. Please try again."}), 503

    try:
        data = json.loads(response.text.strip())
        return jsonify(data)
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return jsonify({"error": "Invalid response from AI"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)