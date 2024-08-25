from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import pyttsx3

app = Flask(__name__)

google_key = "Sua API-KEY Do GeminiAI"
genai.configure(api_key=google_key)
generation_config = {"candidate_count": 1, "temperature": 0.1}
model = genai.GenerativeModel(generation_config=generation_config)
chat = model.start_chat(history=[])

def remover_caracteres_especiais(texto):
    texto_sem_asteriscos = ""
    for caractere in texto:
        if caractere not in "*!@#$%&_-+=¨''":
            texto_sem_asteriscos += caractere
    return texto_sem_asteriscos

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/iniciar_chat', methods=['POST'])
def iniciar_chat():
    data = request.get_json()
    prompt = data.get('text', '')
    response = chat.send_message(prompt)
    response_text = remover_caracteres_especiais(response.text)
    return jsonify({'message': response_text})

if __name__ == '__main__':
    app.run(debug=True)
