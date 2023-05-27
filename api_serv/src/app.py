import uvicorn
from fastapi import FastAPI
from orm import initialize_database

from router import app_router

app = FastAPI(root_path="/")


# @app.on_event("startup")
async def start_database():
    await initialize_database()

app.include_router(app_router)


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80)
