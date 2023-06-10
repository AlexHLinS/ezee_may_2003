import json
import logging
import os
import random
from datetime import datetime

from typing import List, Optional

from beanie import init_beanie, Document
from beanie.odm.operators.find.comparison import In
from pydantic import Field

from orm.activities import ActivityCategories, ActivityMeta
from orm.groups import GroupAddress, GroupSchedule, GroupMeta
from orm.users import UserBio, UserProfile
from orm.users import UserSettings

_logger = logging.getLogger(__name__)


class User(Document):
    user_id: int = Field(alias="id")
    created: datetime
    bio: UserBio
    profile: UserProfile

    class Settings:
        name = "users"


class Group(Document):
    group_id: int = Field(alias="id")
    activity_id: Optional[int]
    address: GroupAddress
    schedule: GroupSchedule
    meta: GroupMeta

    class Settings:
        name = "groups"


class Activity(Document):
    activity_id: int = Field(alias="id")
    category: ActivityCategories
    meta: ActivityMeta

    class Settings:
        name = "activities"


class GlobalPreferences(Document):
    preference_id: int = Field(alias="id")
    offline: float
    group: float
    outdoor: float

    class Settings:
        name = "global_preferences"


async def get_users_for_demo() -> List[User]:
    env = os.getenv("DEMO_USERS")

    if env:
        demo_users = json.loads(env)
    else:
        demo_users = []

    if demo_users:
        users = await User.find(In(User.user_id, demo_users)).to_list()
    else:
        users = await User.find().to_list()

    return users


async def get_user(user_id: int) -> Optional[User]:
    user = await User.find(
        User.user_id == user_id
    ).first_or_none()
    return user


async def delete_user(user: User):
    await user.delete()


async def get_user_settings(user_id: int) -> Optional[UserSettings]:
    if (user := await get_user(user_id)) is None:
        return None
    user_settings = user.profile.settings
    return user_settings


async def initialize_database():
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASS")
    host = os.getenv("MONGO_HOST")
    database = os.getenv("MONGO_DB")

    connection_string = f"mongodb://{user}:{password}@{host}/{database}"

    await init_beanie(
        connection_string=connection_string,
        document_models=[
            User,
            Activity,
            Group,
            GlobalPreferences
        ]
    )
    print("connected")


async def get_default_preferences() -> GlobalPreferences:
    pref = await GlobalPreferences.find(GlobalPreferences.preference_id == 1).first_or_none()
    return pref
