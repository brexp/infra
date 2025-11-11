ggemin
import os
import google.generativeai as genai
import vertexai
from vertexai.generative_models import GenerativeModel
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# --- Configuração ---
# 1. Obtenha sua API Key no Google AI Studio ou no Console do Google Cloud.
# 2. Defina a chave como uma variável de ambiente no seu terminal antes de rodar a API:
#    export GOOGLE_API_KEY='SUA_API_KEY_AQUI'
# O projeto do Google Cloud a ser usado.
# Substitua 'treino-indoor-ohx4v' se estiver usando um projeto diferente.
PROJECT_ID = "treino-indoor-ohx4v"
LOCATION = "us-central1" # Localização para os modelos do Vertex AI

try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    raise RuntimeError("Variável de ambiente GOOGLE_API_KEY não definida. Por favor, configure-a.")
    # Inicializa o SDK do Vertex AI com o projeto e localização definidos.
    # Isso usará as credenciais do gcloud automaticamente.
    vertexai.init(project=PROJECT_ID, location=LOCATION)
except Exception as e:
    raise RuntimeError(f"Erro ao inicializar o Vertex AI SDK: {e}")

# --- Modelos de Dados ---
class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    text: str

# --- Aplicação FastAPI ---
app = FastAPI(
    title="API para Gemini",
    description="Uma API simples para interagir com o modelo Gemini do Google.",
    title="API para Vertex AI Gemini",
    description="Uma API simples para interagir com o modelo Gemini via Vertex AI.",
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
        # Define o modelo a ser usado. "gemini-1.5-pro-latest" é uma ótima escolha.
        model = GenerativeModel("gemini-1.5-pro-latest")
        response = model.generate_content(request.prompt)
        return GenerateResponse(text=response.text)
    except Exception as e:
        # Em um app de produção, você faria um log mais detalhado do erro.
        print(f"Ocorreu um erro: {e}")
        raise HTTPException(status_code=500, detail="Erro ao se comunicar com a API do Gemini.")
        raise HTTPException(status_code=500, detail=f"Erro ao se comunicar com a API do Vertex AI Gemini: {e}")

# --- Para rodar a API (no seu terminal local): ---
# uvicorn main:app --reload
