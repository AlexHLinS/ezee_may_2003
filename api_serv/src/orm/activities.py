import logging

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

_logger = logging.getLogger(__name__)


class ActivityTags(BaseModel):
    seasons: List[str]
    offline: bool
    outdoor: bool
    group: bool
    additional: List[str]


class ActivityCategory(BaseModel):
    id: int
    name: str


class ActivityCategories(BaseModel):
    level_1: Optional[ActivityCategory]
    level_2: Optional[ActivityCategory]
    level_3: Optional[ActivityCategory]


class ActivityMeta(BaseModel):
    description: Optional[str]
    picture: Optional[bytes]
    tags: ActivityTags
    created: datetime
