import logging

from typing import List, Dict, Optional

from pydantic import BaseModel

from .common import Location, AddressTag
_logger = logging.getLogger(__name__)


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


class UserAddress(BaseModel):
    raw: str
    address: Optional[AddressTag]
    location: Optional[Location]


class UserSettings(BaseModel):
    schedule: List[UserSchedule] = [UserSchedule() for i in range(7)]
    travel_time: int = 30
    address: Optional[UserAddress]
    diseases: Optional[List[str]]


class UserWorkdata(BaseModel):
    group_scores: Dict[str, float]
    recommended_categories: Optional[List[str]]


class UserProfile(BaseModel):
    settings: UserSettings
    workdata: UserWorkdata
