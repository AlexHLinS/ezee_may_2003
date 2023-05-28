from typing import List, Dict, Optional

from pydantic import BaseModel, Field
from starlette.responses import JSONResponse

from orm import Activity, UserAddress, GroupAddress, Location, User
from orm import Group as OrmGroup


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
    def build_from_db(cls, obj: Activity) -> 'Category':
        return cls(
            title=obj.meta.name,
            description=obj.meta.description,
            picture=obj.meta.picture,
            season=obj.meta.tags.seasons,
            tags=obj.tags,
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
    def build_from_db(cls, user_address: UserAddress, group_address: GroupAddress) -> 'GroupLocation':
        user_loc, group_loc = user_address.location, group_address.location

        distance = cls._estimated_distance(user_loc, group_loc)
        if distance <= 1:
            isNear = True
        else:
            isNear = False

        estimatedTime = cls._estimated_time(distance)

        return cls(
            address=group_address.raw,
            latitude=group_address.location.latitude,
            longitude=group_address.location.longitude,
            distance=str(int(distance)),
            isNear=isNear,
            estimatedTime=int(estimatedTime),
            nearestSubwayStations=[]
        )

    @staticmethod
    def _estimated_time(
            distance: float
    ) -> float:
        """
        Определяет примерное время пути из первой точки во вторую

        :param distance: расстояние в пути между двумя точками (в метрах)

        :return: оценка времени пути из первой точки во вторую (в минутах)
        """
        return distance / 1.1

    @staticmethod
    def _estimated_distance(
            loc_1: Location,
            loc_2: Location
    ) -> float:
        """
        Определяет расстояние в пути между двумя точками

        :param loc_1: координаты первой точки
        :param loc_2: координаты второй точки

        :return: расстояние в пути между двумя точками (в метрах)
        """
        # TODO: Реализовать
        return 1000


class Group(BaseModel):
    id: int = Field(..., title="")
    picture: Optional[bytes] = Field(..., title="")
    categories: List[str] = Field(..., title="")
    title: Optional[str] = Field(..., title="")
    description: Optional[str] = Field(..., title="")
    location: Optional[GroupLocation] = Field(..., title="")
    schedule: Optional[str] = Field(..., title="")

    @classmethod
    def build_from_db(cls, user: User, group: OrmGroup, activity: Activity) -> 'Group':
        return cls(
            id=group.id,
            title=group.meta.name,
            description=group.meta.description,
            picture=group.meta.picture,
            categories=activity.category,
            location=GroupLocation.build_from_db(user.profile.settings.address, group.address),
            schedule=group.schedule.raw
        )
