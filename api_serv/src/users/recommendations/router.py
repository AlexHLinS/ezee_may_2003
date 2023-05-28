import logging
from typing import List

from fastapi import APIRouter, Body, Query, Depends

from orm import User
from users.recommendations.models import (
    UserCategoriesSet,
    Category,
    Group,
)

from users.recommendations.utils import (
    get_recommended_categories,
    get_recommended_groups,
    set_user_categories
)
from users.utils import get_user_or_404

router = APIRouter(prefix="/{user_id}/recommendations", tags=["Рекомендации пользователя"])

_logger = logging.getLogger(__name__)


@router.get(
    "/categories",
    response_description="Список рекомендованных для пользователя категорий активности",
    response_model=List[Category],
)
async def get_categories(
        user: User = Depends(get_user_or_404),
        limit: int = Query(5, title="Максимальное количество категорий")
):
    """
    Получить список категорий активности рекомендованных для пользователя
    """

    categories = await get_recommended_categories(user.user_id)

    return categories[:limit]


@router.get(
    "/groups",
    response_description="Cписок групп рекомендованных для пользователя к посещению",
    response_model=List[Group],
)
async def get_groups(
        user: User = Depends(get_user_or_404),
        category: str = Query(..., title="Название категории активности группы"),
        limit: int = Query(10, title="Максимальное количество групп")
):
    """
    Получить список групп рекомендованных для пользователя к посещению
    """
    groups = await get_recommended_groups(user.user_id)
    return groups


@router.post(
    "/categories"
)
async def post_categories(
        user: User = Depends(get_user_or_404),
        categories: List[str] = Body(..., title="Список рекомендованных категорий активности")
):
    """
    Задать категории активности для пользователя
    """
    await set_user_categories(user, categories)
    return UserCategoriesSet(user.user_id)
