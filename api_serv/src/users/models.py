import os
from datetime import datetime, date
from typing import List, Optional

from pydantic import BaseModel, Field
from starlette.responses import JSONResponse

from orm.users import UserAddress, UserSchedule
from orm.utils import User
from users.utils import has_cold_start


class SettingsUpdated(JSONResponse):
    def __init__(self, user_id: int, **kwargs):
        super().__init__(
            content={
                "message": f"Settings of user {user_id} has been updated"
            },
            status_code=200,
            **kwargs
        )


class GetUserResponse(BaseModel):
    id: int = Field(..., title="")
    gender: int = Field(..., title="")
    name: str = Field(..., title="")
    surname: str = Field(..., title="")
    patron: str = Field(..., title="")
    birthdate: str = Field(..., title="")
    age: str = Field(..., title="")
    coldStart: bool = Field(..., title="")

    @classmethod
    def build_from_db(cls, obj: User) -> 'GetUserResponse':
        def get_age(birthdate: str) -> str:
            birthdate = datetime.strptime(birthdate, "%Y-%m-%d")
            age = (datetime.now() - birthdate).days // 365
            return age

        birthdate = obj.bio.birthdate
        return cls(
            id=obj.user_id,
            gender=not obj.bio.gender,
            name=obj.bio.name,
            surname=obj.bio.surname,
            patron=obj.bio.patron,
            birthdate=birthdate,
            age=get_age(obj.bio.birthdate),
            coldStart=has_cold_start(obj)
        )


class DemoUser(GetUserResponse):
    pass


class PostUserRequest(BaseModel):
    @classmethod
    def build_from_db(cls, obj: User) -> 'PostUserRequest':
        return cls()


class DaytimeSchedule(BaseModel):
    morning: bool = Field(False, title="")
    noon: bool = Field(False, title="")
    evening: bool = Field(False, title="")

    @classmethod
    def build_from_db(cls, obj: UserSchedule) -> 'DaytimeSchedule':
        return cls(
            morning=obj.morning,
            noon=obj.noon,
            evening=obj.evening,
        )

    def to_db(self) -> UserSchedule:
        return UserSchedule(
            morning=self.morning,
            noon=self.noon,
            evening=self.evening,
        )


class PutUserSettingsRequest(BaseModel):
    address: Optional[str] = Field(None, title="")
    travelTime: Optional[int] = Field(None, title="")
    schedule: Optional[List[DaytimeSchedule]] = Field(None, title="")
    diseases: Optional[List[str]] = Field(None, title="")


class UserLocation(BaseModel):
    address: str = Field(..., title="")
    latitude: str = Field(..., title="")
    longitude: str = Field(..., title="")

    @classmethod
    def build_from_db(cls, obj: UserAddress) -> 'UserLocation':
        return cls(
            address=obj.raw,
            latitude=obj.location.latitude,
            longitude=obj.location.longitude
        )


class GetUserSettingsResponse(BaseModel):
    location: UserLocation = Field(..., title="")
    travelTime: int = Field(..., title="")
    schedule: List[DaytimeSchedule] = Field(..., min_items=7, max_items=7)
    diseases: List[str] = Field(..., title="")

    @classmethod
    def build_from_db(cls, obj: User) -> 'GetUserSettingsResponse':
        settings = obj.profile.settings
        return cls(
            location=UserLocation.build_from_db(settings.address),
            travelTime=settings.travel_time,
            schedule=settings.schedule,
            diseases=settings.diseases or []
        )
