import os
from datetime import datetime, date
from typing import List, Optional

from pydantic import BaseModel, Field, validator
from starlette.responses import JSONResponse

from orm.utils import GlobalPreferences


class PreferencesUpdated(JSONResponse):
    def __init__(self, **kwargs):
        super().__init__(
            content={
                "message": f"Preferences has been updated"
            },
            status_code=200,
            **kwargs
        )


class PreferencesResponse(BaseModel):
    offline: float = Field(0.5)
    group: float = Field(0.5)
    outdoor: float = Field(0.5)

    @classmethod
    def build_from_db(cls, obj: GlobalPreferences) -> 'PreferencesResponse':
        return cls(
            offline=obj.offline,
            group=obj.group,
            outdoor=obj.outdoor
        )


class PostPreferencesRequest(BaseModel):
    offline: Optional[float]
    group: Optional[float]
    outdoor: Optional[float]

    @validator('offline', 'group', 'outdoor')
    def validate_fields(cls, v):
        if 0 <= v <= 1:
            return v
        raise ValueError('Ensure value is between 0 and 1')


class StatsInfo(BaseModel):
    percentage: float
    quantity: int


class StatsResponse(BaseModel):
    offline: StatsInfo
    outdoor: StatsInfo
    group: StatsInfo
