import logging
from typing import List

from fastapi import APIRouter, Body, Depends

from users.models import (
    SettingsUpdated,
    DemoUser,
    GetUserResponse,
    PutUserSettingsRequest,
    GetUserSettingsResponse
)
from orm.utils import get_users_for_demo, User
from users.utils import get_user_or_404

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

    users = await get_users_for_demo()

    demo_users = [DemoUser.build_from_db(u) for u in users]

    return demo_users


@router.get(
    "/{user_id}",
    response_description="Данные пользователя",
    response_model=GetUserResponse,
)
async def get_user(
        user: User = Depends(get_user_or_404),
):
    """
    Получить пользователя
    """
    return GetUserResponse.build_from_db(user)


@router.put(
    "/{user_id}/settings"
)
async def update_user_settings(
        user: User = Depends(get_user_or_404),
        new_settings: PutUserSettingsRequest = Body(..., title="Настройки пользователя")
):
    """
    Обновить настройки пользователя
    """

    if new_settings.address:
        user.profile.settings.address.raw = new_settings.address

    if new_settings.travelTime:
        user.profile.settings.travel_time = new_settings.travelTime

    if new_settings.schedule:
        user.profile.settings.schedule = [i.to_db() for i in new_settings.schedule]

    if new_settings.diseases:
        user.profile.settings.diseases = new_settings.diseases

    await user.save()

    return SettingsUpdated(user.user_id)


@router.get(
    "/{user_id}/settings",
    response_description="Настройки пользователя",
    response_model=GetUserSettingsResponse,
)
async def get_user_settings(
        user: User = Depends(get_user_or_404),
):
    """
    Получить настройки пользователя
    """
    return GetUserSettingsResponse.build_from_db(user)
