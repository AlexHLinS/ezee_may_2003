from typing import Optional

from pydantic import BaseModel


class Location(BaseModel):
    latitude: str
    longitude: str


class AddressTag(BaseModel):
    region: Optional[str]
    district: Optional[str]
    city: Optional[str]
    road: Optional[str]
    house_number: Optional[str]
    building: Optional[str]
