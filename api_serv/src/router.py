from fastapi import APIRouter

from users.router import router as users_router
from users.recommendations.router import router as recommendations_router
from admin.router import router as admin_router

users_router.include_router(recommendations_router)

app_router = APIRouter()
app_router.include_router(users_router)
app_router.include_router(admin_router)
