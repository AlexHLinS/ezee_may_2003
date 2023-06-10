import os

from fastapi import HTTPException

from orm.users import UserAddress
from orm.utils import get_user, User


async def get_user_or_404(user_id: int) -> User:
    user = await get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return user


def parse_address(address: str) -> str:
    return address


def has_cold_start(user: User):
    s = 0
    for _, score in user.profile.workdata.group_scores.items():
        s += score

    if s >= float(os.getenv("COLD_START_BOUND", 0.7)):
        return False

    return True
