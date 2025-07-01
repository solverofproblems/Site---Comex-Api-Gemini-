from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()
api_gemini = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)

# Configuração da API do Google Gemini
genai.configure(api_key=api_gemini)

# Inicializar o modelo
modelo = genai.GenerativeModel('gemini-2.5-pro')

@app.route('/')
def index():
    """Rota principal que serve a página HTML"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint para processar mensagens do chatbot"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Mensagem vazia'}), 400
        
        # Gerar resposta usando o modelo Gemini
        response = modelo.generate_content(user_message)
        
        # Log da conversa (opcional)
        log_conversation(user_message, response.text)
        
        return jsonify({
            'response': response.text,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Erro no processamento: {str(e)}")
        return jsonify({
            'error': 'Erro interno do servidor',
            'message': str(e)
        }), 500

@app.route('/health')
def health_check():
    """Endpoint para verificar se o servidor está funcionando"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

def log_conversation(user_message, bot_response):
    """Função para logar conversas (opcional)"""
    try:
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message,
            'bot_response': bot_response
        }
        
        # Salvar em arquivo de log (opcional)
        with open('chat_logs.json', 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
            
    except Exception as e:
        print(f"Erro ao salvar log: {str(e)}")

if __name__ == '__main__':
    print("🚀 Iniciando TradeBot Pro...")
    print("📡 Servidor rodando em: http://localhost:5000")
    print("🤖 Chatbot integrado com Google Gemini")
    print("🎨 Interface moderna e responsiva")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000) 