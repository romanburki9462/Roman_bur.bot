# Roman bur.Bot

A polished local AI chatbot using:

- Python + Flask backend
- React + Vite frontend
- Ollama + llama3.2
- Orange/black modern UI
- Responsive mobile layout
- Animated loading/thinking states
- Chat history in the current conversation
- Connection status
- Copy responses
- New chat
- Quick prompts

## 1. Start Ollama

Make sure Ollama is installed and running.

Then in Command Prompt:

```bash
ollama pull llama3.2
```

You can test:

```bash
ollama run llama3.2
```

## 2. Backend

Open CMD:

```bash
cd roman-burbot\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs at:

http://localhost:5000

## 3. Frontend

Open another CMD:

```bash
cd roman-burbot\frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:

http://localhost:5173

## Project structure

roman-burbot/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── styles.css

## Notes

The AI model runs locally through Ollama. The browser talks to Flask, and Flask talks to Ollama.
No OpenAI API key is required for this setup.
