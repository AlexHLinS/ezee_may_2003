import uvicorn
from fastapi import FastAPI
from generator import Payload, router, Answer, ErrorAnswer


app = FastAPI(root_path="/")


@app.get('/')
async def index():
    """ Простой entrypoint для проверки доступности сервиса """
    return {"status":"ok"}

@app.post('/send/')
async def send(data: Payload)-> Answer | ErrorAnswer:
    """ Основной entrypoint для обмена сообщениями с моделью """
    return await router(data)

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80)
