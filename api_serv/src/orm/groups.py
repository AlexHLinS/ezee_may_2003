import logging

from datetime import datetime
from typing import List, Optional

from .common import Location, AddressTag
from pydantic import BaseModel, Field

_logger = logging.getLogger(__name__)


class GroupAddress(BaseModel):
    raw: str
    address: Optional[AddressTag]
    location: Optional[Location]


class RawGroupSchedule(BaseModel):
    active_period: Optional[str]
    close_period: Optional[str]
    planned: Optional[str]


class GroupSchedule(BaseModel):
    raw: RawGroupSchedule


class GroupTags(BaseModel):
    additional: List[str] = Field(default_factory=list)


class GroupMeta(BaseModel):
    tags: GroupTags
    created: datetime
