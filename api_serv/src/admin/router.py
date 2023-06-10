import logging

from fastapi import APIRouter, Body, Query

from admin.models import (
    PostPreferencesRequest,
    PreferencesResponse,
    PreferencesUpdated,
    StatsResponse
)
from orm.utils import get_default_preferences
from admin.utils import build_stats

router = APIRouter(prefix="/admin", tags=["Глобальные настройки рекомендаций"])

_logger = logging.getLogger(__name__)


@router.get(
    "/preferences",
    response_description="Глобальные настройки рекомендаций",
    response_model=PreferencesResponse,
)
async def get_preferences():
    """
    Получить глобальные настройки рекомендаций
    """

    pref = await get_default_preferences()
    response = PreferencesResponse.build_from_db(pref)

    return response


@router.post(
    "/preferences"
)
async def post_preferences(
        new_preferences: PostPreferencesRequest = Body(..., title="Новые глобальные настройки рекомендаций")
):
    """
    Задать глобальные настройки рекомендаций
    """

    pref = await get_default_preferences()

    offline, group, outdoor = new_preferences.offline, new_preferences.group, new_preferences.outdoor

    if offline:
        pref.offline = offline

    if group:
        pref.group = group

    if outdoor:
        pref.outdoor = outdoor

    await pref.save()

    return PreferencesUpdated()


@router.get(
    "/stats",
    response_description="Статистика",
    response_model=StatsResponse,
)
async def get_stats(
        top: int = Query(default=3)
):
    """
    Получить статистику по содержимому топа из group_scores пользователей
    """

    stats = await build_stats(top=top)
    return stats
