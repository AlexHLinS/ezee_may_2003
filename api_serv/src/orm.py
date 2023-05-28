import logging

from datetime import datetime
from typing import List, Dict, Optional

from beanie import Document
from beanie.odm.operators.find.comparison import In
from pydantic import BaseModel, Field

_logger = logging.getLogger(__name__)


# USER


class UserBio(BaseModel):
    gender: int
    name: str
    surname: str
    patron: str
    birthdate: str


class UserSchedule(BaseModel):
    morning: bool = False
    noon: bool = False
    evening: bool = False


class Location(BaseModel):
    latitude: str
    longitude: str


class AddressTag(BaseModel):
    city: str
    road: str
    house_number: str
    building: str


class UserAddress(BaseModel):
    raw: str
    address: Optional[AddressTag]
    location: Optional[Location]


class UserSettings(BaseModel):
    schedule: List[UserSchedule] = [UserSchedule() for i in range(7)]
    travel_time: int = 30
    address: Optional[UserAddress]
    diseases: Optional[List[str]]


class AttendanceScore(BaseModel):
    value: Optional[int]
    comment: Optional[str]


class Attendance(BaseModel):
    group_id: int
    date: datetime
    score: AttendanceScore


class UserWorkdata(BaseModel):
    group_scores: Dict[str, float]
    recommended_categories: Optional[List[str]]


class UserProfile(BaseModel):
    settings: UserSettings
    attendances: List[Attendance]
    workdata: UserWorkdata


class User(Document):
    user_id: int = Field(alias="id")
    created: datetime
    bio: UserBio
    profile: UserProfile

    class Settings:
        name = "users"


# ACTIVITIES

class ActivityTags(BaseModel):
    seasons: List[str]
    additional: List[str]


class ActivityCategory(BaseModel):
    id: int
    name: str


class ActivityCategories(BaseModel):
    level_1: Optional[ActivityCategory]
    level_2: Optional[ActivityCategory]
    level_3: Optional[ActivityCategory]


class ActivityMeta(BaseModel):
    name: str
    description: Optional[str]
    picture: Optional[bytes]
    tags: ActivityTags
    created: datetime


class Activity(Document):
    activity_id: int = Field(alias="id")
    category: ActivityCategories
    meta: ActivityMeta

    class Settings:
        name = "activities"


# GROUPS

class GroupAddress(BaseModel):
    raw: str
    address: Optional[AddressTag]
    location: Optional[Location]


class GroupSchedule(BaseModel):
    raw: str
    start: Optional[datetime]
    end: Optional[datetime]
    cron: List[str]


class GroupTags(BaseModel):
    online: bool
    individual: bool
    outdoor: bool
    additional: List[str]


class GroupMeta(BaseModel):
    name: str
    description: Optional[str]
    picture: Optional[bytes]
    tags: GroupTags
    created: datetime


class Group(Document):
    group_id: int = Field(alias="id")
    activity_id: int
    address: GroupAddress
    schedule: GroupSchedule
    meta: GroupMeta

    class Settings:
        name = "groups"


async def get_users_for_demo(user_ids: List[int]) -> List[User]:
    users = await User.find(
        In(User.id, user_ids),
    ).to_list()
    return users


async def get_user(user_id: int) -> Optional[User]:
    user = await User.find(
        User.id == user_id
    ).first_or_none()
    return user


async def delete_user(user: User):
    await user.delete()


async def get_user_settings(user_id: int) -> Optional[UserSettings]:
    if (user := await get_user(user_id)) is None:
        return None
    user_settings = user.profile.settings
    return user_settings
