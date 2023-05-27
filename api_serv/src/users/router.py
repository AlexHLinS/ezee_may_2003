import logging
from typing import List

from fastapi import APIRouter, Path, Body
from fastapi.responses import JSONResponse

from users.models import (
    DemoUser,
    GetUserResponse,
    PostUserRequest,
    PutUserSettingsRequest,
    GetUserSettingsResponse, UserLocation, DaytimeSchedule
)

router = APIRouter(prefix="/users", tags=["Пользователи"])

_logger = logging.getLogger(__name__)


@router.get(
    "/demo",
    response_description="Список пользователей для демо",
    response_model=List[DemoUser],
)
async def get_demo_users():
    """
    Получить пользователей для демо
    """
    return [
        DemoUser(
            id=123,
            name="Григорий",
            surname="Кузнецов",
            birthdate="12.03.1951",
            coldStart=False
        ),
        DemoUser(
            id=456,
            name="Владимир",
            surname="Кожевников",
            birthdate="24.05.1946",
            coldStart=True
        )
    ]


@router.get(
    "/{user_id}",
    response_description="Данные пользователя",
    response_model=GetUserResponse,
)
async def get_user(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
):
    """
    Получить пользователя
    """
    ...


@router.post(
    "/{user_id}"
)
async def create_user(
        user: PostUserRequest = Body(..., title="Данные пользователя для регистрации"),
):
    """
    Создать пользователя
    """
    ...


@router.delete(
    "/{user_id}"
)
async def delete_user(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
):
    """
    Удалить пользователя
    """
    ...


@router.put(
    "/{user_id}/settings"
)
async def update_user_settings(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
        settings: PutUserSettingsRequest = Body(..., title="Настройки пользователя"),
):
    """
    Обновить настройки пользователя
    """
    return JSONResponse(
        content={
            "message": f"Settings of user {user_id} has been updated"
        },
        status_code=200
    )


@router.get(
    "/{user_id}/settings",
    response_description="Настройки пользователя",
    response_model=GetUserSettingsResponse,
)
async def get_user_settings(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
):
    """
    Получить настройки пользователя
    """
    return GetUserSettingsResponse(
        location=UserLocation(
            address="г.Москва, ул.Пушкина, д.13",
            latitude="15.123123",
            longitude="89.213123",
        ),
        travelTime=15,
        schedule=[
            DaytimeSchedule(),
            DaytimeSchedule(),
            DaytimeSchedule(),
            DaytimeSchedule(),
            DaytimeSchedule(),
            DaytimeSchedule(morning=True),
            DaytimeSchedule(),
        ],
        diseases=["варикоз", "артрит"]
    )
