from typing import List, Tuple

from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.find.logical import And

from orm.utils import Group, User, Activity
from users.utils import has_cold_start


async def get_activities_by_level2_name(name: str) -> List[Activity]:
    activities = await Activity.find(Activity.category.level_2.name == name).to_list()
    return activities


async def get_activities_by_level3_name(name: str) -> List[Activity]:
    activities = await Activity.find(Activity.category.level_3.name == name).to_list()
    return activities


async def get_groups_from_group_scores(user: User) -> List[Group]:
    group_scores = user.profile.workdata.group_scores
    group_ids = [int(i) for i in list(group_scores)]
    groups = await Group.find(In(Group.group_id, group_ids)).to_list()
    return groups


async def get_recommended_groups(user: User, category: str, limit: int = 10) -> List[Tuple[Activity, Group]]:
    activities = await get_activities_by_level2_name(category)

    if not has_cold_start(user):
        activity_ids = [a.activity_id for a in activities]
        groups = await get_groups_from_group_scores(user)
        groups_by_category = [group for group in groups if group.activity_id in activity_ids]
    else:
        recommended_categories = user.profile.workdata.recommended_categories
        activity_ids = [a.activity_id for a in activities if a.category.level_3.name in recommended_categories]
        groups_by_category = await Group.find(In(Group.activity_id, activity_ids)).to_list(length=limit)

    result = []
    for g in groups_by_category:
        result.append(
            (
                await Activity.find(Activity.activity_id == g.activity_id).first_or_none(),
                g
            )
        )

    return result[:limit]


async def get_recommended_activities(user: User, limit: int) -> List[Activity]:
    if not has_cold_start(user):
        groups = await get_groups_from_group_scores(user)
        activity_ids = [group.activity_id for group in groups]
        all_activities = await Activity.find(In(Activity.activity_id, activity_ids)).to_list()
    else:
        recommended_categories = user.profile.workdata.recommended_categories
        if recommended_categories is None:
            return []
        all_activities = []
        for rc in recommended_categories:
            all_activities.extend(await get_activities_by_level3_name(rc))

    # оставляем только активности уникальные по level_2 имени
    activities, activity_names = [], []
    for a in all_activities:
        name = a.category.level_2.name
        if name in activity_names:
            continue
        activity_names.append(name)
        activities.append(a)

    return activities[:limit]


async def set_user_categories(
        user: User,
        categories: List[str]
):
    user.profile.workdata.recommended_categories = categories
    await user.save()
