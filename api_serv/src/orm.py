import logging
import os

from beanie import init_beanie

from datetime import datetime
from typing import List, Dict, Optional, Tuple

from beanie import Document
from pydantic import BaseModel

_logger = logging.getLogger(__name__)


# USER

class UserBio(BaseModel):
    gender: int  # 0 - male; 1 - female
    name: str
    surname: str
    birthdate: datetime

    def string_gender(self):
        return "male" if not self.gender else "female"


class DaytimeSchedule(BaseModel):
    morning: bool = False
    noon: bool = False
    evening: bool = False


class ExtendedSchedule(BaseModel):
    ...  # TODO: Структуру взять из датасета


class LocationTag(BaseModel):
    address: str
    latitude: float
    longitude: float
    # TODO: Дополнить полями из датасета


class UserSettings(BaseModel):
    schedule: List[DaytimeSchedule]  # TODO: Перенести в модели запроса/ответа: = Field(..., min_items=7, max_items=7)
    travel_time: int = 30  # в минутах
    location: LocationTag  # TODO: По дефолту задать центр Москвы
    diseases: Optional[List[str]]  # Если None, то считается, что пользователь не задавал список болезней
    # TODO: Задать дефолтное расписание при инициализации


class AttendanceScore(BaseModel):
    value: int  # 1-5
    comment: str


class Attendance(BaseModel):
    activity_id: int
    date: datetime
    score: AttendanceScore


class Workdata(BaseModel):
    activity_scores: Dict[str, str]
    # TODO: Положить инфу о признаке холодного старта


class UserProfile(BaseModel):
    settings: UserSettings
    attendances: List[Attendance]
    workdata: Workdata


class User(Document):
    user_id: int
    created: datetime
    role: str = "user"
    bio: UserBio
    profile: UserProfile

    class Settings:
        name = "users"


# ACTIVITY

class ActivityTag(BaseModel):
    ...


class CategoryTag(BaseModel):
    level: int
    value: str


class ActivitySchedule(BaseModel):
    period: Tuple[datetime, datetime]
    # pip install pretty-cron
    crontab: List[str]


class ActivityTags(BaseModel):
    outdoor: bool
    group: bool
    seasons: List[str]  # spring/winter/summer/autumn


class Activity(Document):
    activity_id: int
    created: datetime
    title: str
    description: str
    location: LocationTag
    online: bool
    schedule: List[ActivitySchedule]  # TODO: Взять из датасета
    category: List[str]  # ["Образование", "Информационные технологии",	"Курсы компьютерной грамотности"]
    tags: ActivityTags


async def initialize_database():
    host = os.getenv("MONGO_HOST")
    assert host, "MONGO_HOST is not defined"

    database = os.getenv("MONGO_DATABASE")
    assert database, "MONGO_DATABASE is not defined"

    user = os.getenv("MONGO_USER")
    assert user, "MONGO_USER is not defined"

    password = os.getenv("MONGO_PASSWORD")
    assert password, "MONGO_PASSWORD is not defined"

    connection_string = f"mongodb://{user}:{password}@{host}/{database}"

    await init_beanie(
        connection_string=connection_string,
        document_models=[
            User,
        ]
    )

    _logger.info(f"MongoDB at {host}/{database} has been initialized")
