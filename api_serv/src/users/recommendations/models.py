import os
from typing import List, Dict, Optional

from pydantic import BaseModel, Field
from starlette.responses import JSONResponse

from orm.common import Location
from orm.groups import GroupAddress as OrmGroupAddress
from orm.utils import Group as OrmGroup, Activity as OrmActivity
from users.recommendations.misc import estimated_distance, get_nearest_subway_stations, fix_address


class UserCategoriesSet(JSONResponse):
    def __init__(self, user_id: int, **kwargs):
        super().__init__(
            content={
                "message": f"Categories of user {user_id} has been set"
            },
            status_code=200,
            **kwargs
        )


class Category(BaseModel):
    title: Optional[str] = Field(..., title="")
    description: Optional[str] = Field(..., title="")
    picture: Optional[bytes] = Field(..., title="")
    season: Optional[str] = Field(..., title="")
    tags: List[str] = Field(..., title="")

    @classmethod
    def build_from_db(cls, obj: OrmActivity) -> 'Category':
        title = obj.category.level_2.name
        season = "круглый год"

        return cls(
            title=title,
            description=obj.meta.description,
            picture=obj.meta.picture,
            season=season,
            tags=obj.meta.tags.additional,
        )

    @staticmethod
    def _get_string_season(seasons: List[str]) -> Optional[str]:
        if len(seasons) == 4:
            return "круглый год"
        elif len(seasons) == 1:
            return seasons[0]
        else:
            return None


class GroupLocation(BaseModel):
    address: str = Field(..., title="")
    latitude: str = Field(..., title="")
    longitude: str = Field(..., title="")
    distance: str = Field(..., title="")
    isNear: bool = Field(..., title="")
    estimatedTime: int = Field(..., title="")
    nearestSubwayStations: Optional[List[Dict[str, int]]] = Field(..., title="")

    @classmethod
    def build_from_db(
            cls,
            group_address: OrmGroupAddress,
            user_location: Location
    ) -> 'GroupLocation':
        group_address_string = fix_address(group_address.raw)
        group_latitude, group_longitude = group_address.location.latitude, group_address.location.longitude

        group_loc = (float(group_address.location.latitude), float(group_address.location.longitude))
        user_loc = (float(user_location.latitude), float(user_location.longitude))
        distance = estimated_distance(user_loc, group_loc)
        car_time = distance / float(os.getenv("CAR_SPEED", 9)) / 60  # в минутах
        bus_time = distance / float(os.getenv("BUS_SPEED", 4)) / 60  # в минутах
        foot_time = distance / float(os.getenv("FOOT_SPEED", 1.2)) / 60  # в минутах
        is_near = distance <= int(os.getenv("NEAR_DISTANCE", 1000))

        return cls(
            address=group_address_string,
            latitude=group_latitude,
            longitude=group_longitude,
            distance=int(distance),
            isNear=is_near,
            estimatedTime=car_time,
            nearestSubwayStations=[],
            # TODO: Добавить поля в саму модель
            # estimatedBusTime=bus_time,
            # estimatedCarTime=car_time,
            # estimatedFootTime=foot_time,
            # nearestSubwayStations=get_nearest_subway_stations(group_loc, threshold=int(os.getenv("NEAR_SUBWAY", 500)))
        )


class Group(BaseModel):
    id: int = Field(..., title="")
    picture: Optional[bytes] = Field(None, title="")
    categories: List[str] = Field(..., title="")
    title: Optional[str] = Field(..., title="")
    description: Optional[str] = Field(..., title="")
    location: Optional[GroupLocation] = Field(..., title="")
    schedule: Optional[str] = Field(..., title="")

    @classmethod
    async def build_from_db(
            cls,
            group: OrmGroup,
            activity: OrmActivity,
            user_location: Location
    ) -> 'Group':
        schedule = group.schedule.raw.planned or group.schedule.raw.active_period or group.schedule.raw.close_period
        if schedule:
            schedule = schedule.split("; ")[0]

        return cls(
            id=group.group_id,
            title=activity.category.level_3.name,
            description=activity.meta.description,
            categories=[
                activity.category.level_1.name,
                activity.category.level_2.name,
                activity.category.level_3.name,
            ],
            location=GroupLocation.build_from_db(
                group.address,
                user_location
            ),
            schedule=schedule
        )
