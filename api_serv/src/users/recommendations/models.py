from typing import List

from pydantic import BaseModel


class Category(BaseModel):
    title: str
    description: str
    picture: bytes
    season: str
    tags: List[str]


class GroupLocation(BaseModel):
    address: str
    latitude: str
    longitude: str
    distance: str
    isNear: bool


class Group(BaseModel):
    id: int
    picture: bytes
    categories: List[str]
    title: str
    description: str
    location: GroupLocation
    schedule: str


class QuestionOptions(BaseModel):
    question: str
    options: List[str]


class QuestionAnswer(BaseModel):
    question: str
    answer: str
