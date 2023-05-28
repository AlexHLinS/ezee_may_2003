from fastapi import HTTPException

from orm import User, get_user, UserAddress


async def get_user_or_404(user_id: int) -> User:
    user = await get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return user


def parse_address(address: str) -> UserAddress:
    # TODO: Реализовать
    return UserAddress()