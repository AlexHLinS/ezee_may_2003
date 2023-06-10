import uvicorn
from fastapi import FastAPI, Request, Response
from starlette.middleware.cors import CORSMiddleware

from generator import (
     Payload, Payload_q2, router, ask_q1, ask_q2, 
     Answer, Answer_q1, Answer_q2, ErrorAnswer
     )


app = FastAPI(root_path="/")

# handle CORS preflight requests
@app.options('/{rest_of_path:path}')
async def preflight_handler(request: Request, rest_of_path: str) -> Response:
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response

# set CORS headers
@app.middleware("http")
async def add_CORS_header(request: Request, call_next):
    response = await call_next(request)
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response


# set CORS headers
@app.middleware("https")
async def add_CORS_header(request: Request, call_next):
    response = await call_next(request)
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response

@app.get('/')
async def index():
    """ Простой entrypoint для проверки доступности сервиса """
    return {"status":"ok"}

@app.post('/send/')
async def send(data: Payload)-> Answer | ErrorAnswer:
    """ 
    Основной entrypoint для обмена сообщениями с моделью 
    (оставлен для обратной совместимости)
    """
    return await router(data)

@app.post('/send_q1/')
async def send_q1(data: Payload)-> Answer_q1 | ErrorAnswer:
    """ Entrypoint для генерации вопросов """
    return await ask_q1(data)

@app.post('/send_q2/')
async def send_q2(data: Payload_q2)-> Answer_q2 | ErrorAnswer:
    """ 
    Entrypoint для получения рекомендаций 5 направлений level3
    на основании ответов 
    """
    return await ask_q2(data)


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80)
