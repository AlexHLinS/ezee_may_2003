from typing import List

from orm import Activity, User


async def get_recommended_categories(user_id: int) -> List[Activity]:
    pass


async def get_recommended_groups(user_id: int) -> List[Activity]:
    pass


async def set_user_categories(
        user: User,
        categories: List[str]
):
    user.profile.workdata.recommended_categories = categories
    # TODO: Реализовать
