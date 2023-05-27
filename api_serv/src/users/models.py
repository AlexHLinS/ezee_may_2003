from typing import List, Optional

from pydantic import BaseModel


class DemoUser(BaseModel):
    id: int
    name: str
    surname: str
    birthdate: str
    coldStart: bool


class GetUserResponse(BaseModel):
    pass


class PostUserRequest(BaseModel):
    pass


class DaytimeSchedule(BaseModel):
    morning: bool = False
    noon: bool = False
    evening: bool = False


class PutUserSettingsRequest(BaseModel):
    address: Optional[str]
    travelTime: Optional[int]
    schedule: Optional[List[DaytimeSchedule]]
    diseases: Optional[List[str]]


class UserLocation(BaseModel):
    address: str
    latitude: str
    longitude: str


class GetUserSettingsResponse(BaseModel):
    location: UserLocation
    travelTime: int
    schedule: List[DaytimeSchedule]
    diseases: List[str]
