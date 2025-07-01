import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_gemini = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=api_gemini)

for model in genai.list_models():
    if "generateContent" in model.supported_generation_methods:
        print(model.name)


# modelo = genai.GenerativeModel('gemini-1.5-flash-latest')

# continuacao = True

# while continuacao:
#     pergunta = input()
#     if pergunta.lower() == "fim":
#         continuacao = False 
#     else:
#         resposta = modelo.generate_content(pergunta)
#         print(resposta.text)