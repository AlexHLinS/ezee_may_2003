import uvicorn
from fastapi import FastAPI, Request, Response

from orm.utils import initialize_database

from router import app_router

app = FastAPI(root_path="/")


@app.on_event("startup")
async def init_db():
    await initialize_database()


# handle CORS preflight requests
@app.options('/{rest_of_path:path}')
async def preflight_handler(request: Request, rest_of_path: str) -> Response:
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = "*"
    response.headers['Access-Control-Allow-Headers'] = "*"
    return response


# set CORS headers
@app.middleware("http")
async def add_CORS_header(request: Request, call_next):
    response = await call_next(request)
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Methods'] = "*"
    response.headers['Access-Control-Allow-Headers'] = "*"
    return response


app.include_router(app_router)


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80)


"""
use backend

db.createUser(
  {
    user: "mayhack",
    pwd: "oi2dj8jdo2",
    roles: [ "readWrite" ]
  }
)

"""