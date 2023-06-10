import asyncio
import logging
import os
from typing import List, Optional

from fastapi import APIRouter, Body, Query, Depends

from orm.utils import User
from users.recommendations.models import (
    UserCategoriesSet,
    Category,
    Group,
)

from users.recommendations.utils import (
    get_recommended_activities,
    get_recommended_groups,
    set_user_categories,
)
from users.utils import get_user_or_404

router = APIRouter(prefix="/{user_id}/recommendations")

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

    activities = await get_recommended_activities(user, limit)

    # Оставляем только те активности, по которым могут быть рекомендованы группы
    # FIXME: Разрулить получше, так как много лишних действий
    if filter_by_distance():
        tasks = [get_groups(user, a.category.level_2.name, None) for a in activities]
        groups = await asyncio.gather(*tasks)
        activities = [activities[i] for i in range(len(groups)) if groups[i]]  # type: ignore

    categories = [Category.build_from_db(a) for a in activities]

    return categories[:limit]


@router.get(
    "/groups",
    response_description="Cписок групп рекомендованных для пользователя к посещению",
    response_model=List[Group],
)
async def get_groups(
        user: User = Depends(get_user_or_404),
        category: str = Query(..., title="Название категории активности группы"),
        limit: Optional[int] = Query(10, title="Максимальное количество групп")
):
    """
    Получить список групп рекомендованных для пользователя к посещению
    """
    activity_group_pairs = await get_recommended_groups(user, category, limit)
    user_location = user.profile.settings.address.location
    groups = [await Group.build_from_db(g, a, user_location) for a, g in activity_group_pairs]

    if filter_by_distance():
        user_travel_time = user.profile.settings.travel_time
        groups = [g for g in groups if g.location.estimatedTime <= user_travel_time]

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


def filter_by_distance() -> bool:
    return os.getenv("FILTER_BY_DISTANCE") == "1"