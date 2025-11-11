gemin
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# --- Configuração ---
# 1. Obtenha sua API Key no Google AI Studio ou no Console do Google Cloud.
# 2. Defina a chave como uma variável de ambiente no seu terminal antes de rodar a API:
#    export GOOGLE_API_KEY='SUA_API_KEY_AQUI'

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    raise RuntimeError("Variável de ambiente GOOGLE_API_KEY não definida. Por favor, configure-a.")

# --- Modelos de Dados ---
class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    text: str

# --- Aplicação FastAPI ---
app = FastAPI(
    title="API para Gemini",
    description="Uma API simples para interagir com o modelo Gemini do Google.",
    version="1.0.0"
)

# --- Endpoint da API ---
@app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """
    Recebe um prompt e retorna o texto gerado pelo Gemini.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="O prompt não pode estar vazio.")

    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(request.prompt)
        return GenerateResponse(text=response.text)
    except Exception as e:
        # Em um app de produção, você faria um log mais detalhado do erro.
        print(f"Ocorreu um erro: {e}")
        raise HTTPException(status_code=500, detail="Erro ao se comunicar com a API do Gemini.")

# --- Para rodar a API (no seu terminal local): ---
# uvicorn main:app --reload
