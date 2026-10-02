from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import os

app = Flask(__name__)
CORS(app)

MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

SYSTEM_PROMPT = """
You are Roman bur.Bot, a helpful, friendly AI assistant.
Give clear, accurate and useful answers.
Use simple language when the user asks for simple explanations.
Be concise unless the user asks for detail.
"""

@app.get("/")
def home():
    return jsonify({"status": "ok", "bot": "Roman bur.Bot", "model": MODEL})

@app.get("/api/health")
def health():
    try:
        ollama.list()
        return jsonify({"ok": True, "model": MODEL})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 503

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    history = data.get("history") or []

    if not message:
        return jsonify({"error": "Message is required"}), 400

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Keep only the latest messages to avoid unnecessarily large requests.
    for item in history[-12:]:
        role = item.get("role")
        content = item.get("content")
        if role in ("user", "assistant") and isinstance(content, str) and content.strip():
            messages.append({"role": role, "content": content[:12000]})

    messages.append({"role": "user", "content": message})

    try:
        response = ollama.chat(
            model=MODEL,
            messages=messages,
            options={
                "temperature": 0.7,
            }
        )
        answer = response["message"]["content"]
        return jsonify({"answer": answer, "model": MODEL})
    except Exception as e:
        return jsonify({
            "error": "Could not connect to Ollama. Make sure Ollama is running and llama3.2 is installed.",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
