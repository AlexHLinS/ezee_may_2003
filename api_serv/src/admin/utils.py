import asyncio

from typing import Dict, Generator, Tuple, List

from admin.models import StatsResponse, StatsInfo
from orm.utils import Activity, get_default_preferences, Group, User
from collections import Counter


async def get_activity_by_group(group_id: str) -> Activity:
    group_id = int(group_id)
    group = await Group.find(Group.group_id == group_id).first_or_none()
    activity = await Activity.find(Activity.activity_id == group.activity_id).first_or_none()
    return activity


async def get_sorted_activity_scores(
        group_scores: Dict[str, float],
        apply_global_preferences: bool = True
) -> List[Tuple[Activity, float]]:
    group_scores = [(k, v) for k, v in group_scores.items()]

    tasks = [get_activity_by_group(group_id) for group_id, _ in group_scores]
    activities = await asyncio.gather(*tasks)

    activity_scores = [(activities[i], group_scores[i][1]) for i in range(len(group_scores))]

    if apply_global_preferences:
        pref = await get_default_preferences()
        activity_scores = activity_scores_with_global_preferences(
            activity_scores,
            pref.outdoor,
            pref.offline,
            pref.group
        )

    sorted_activity_scores = sorted(activity_scores, key=lambda x: x[1], reverse=True)
    return sorted_activity_scores


def activity_scores_with_global_preferences(
        activity_scores: List[Tuple[Activity, float]],
        outdoor: float,
        offline: float,
        group: float
) -> List[Tuple[Activity, float]]:
    updated_activity_scores = []
    for activity, score in activity_scores:
        if activity is None:
            continue

        updated_score = score

        if activity.meta.tags.outdoor:
            updated_score *= 1 + (outdoor - 0.5)
        # else:
            # updated_score *= 1 - (outdoor - 0.5)

        if activity.meta.tags.offline:
            updated_score *= 1 + (offline - 0.5)
        # else:
            # updated_score *= 1 - (offline - 0.5)

        if activity.meta.tags.group:
            updated_score *= 1 + (group - 0.5)
        # else:
            # updated_score *= 1 - (group - 0.5)

        updated_activity_scores.append((activity, updated_score))

    return updated_activity_scores


async def build_stats(top: int) -> StatsResponse:
    """
    Формирует статистику по содержимому топ-3 из group_scores пользователей
    """

    users = await User.find(
        {
            "profile.workdata.group_scores": {
                "$ne": None
            }
        }
    ).to_list()

    stats_counter = Counter()

    tasks = [get_sorted_activity_scores(user.profile.workdata.group_scores) for user in users]
    all_sorted_activity_scores = await asyncio.gather(*tasks)

    for activity_scores in all_sorted_activity_scores:
        top_activity_scores = activity_scores[:top]
        for activity, score in top_activity_scores:
            if activity.meta.tags.outdoor:
                stats_counter["outdoor"] += 1
                break
        for activity, score in top_activity_scores:
            if activity.meta.tags.offline:
                stats_counter["offline"] += 1
                break
        for activity, score in top_activity_scores:
            if activity.meta.tags.group:
                stats_counter["group"] += 1
                break

    return StatsResponse(
        offline=StatsInfo(
            percentage=stats_counter["offline"] / len(users),
            quantity=stats_counter["offline"]
        ),
        outdoor=StatsInfo(
            percentage=stats_counter["outdoor"] / len(users),
            quantity=stats_counter["outdoor"]
        ),
        group=StatsInfo(
            percentage=stats_counter["group"] / len(users),
            quantity=stats_counter["group"]
        )
    )
