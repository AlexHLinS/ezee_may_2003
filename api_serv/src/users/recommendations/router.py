import logging
from typing import List

from fastapi import APIRouter, Path, Body, Query
from fastapi.responses import JSONResponse

from users.recommendations.models import (
    Category,
    Group,
    GroupLocation,
    QuestionOptions,
    QuestionAnswer
)

router = APIRouter(prefix="/{user_id}/recommendations", tags=["Рекомендации пользователя"])

_logger = logging.getLogger(__name__)


@router.get(
    "/categories",
    response_description="Список рекомендованных для пользователя категорий активности",
    response_model=List[Category],
)
async def get_categories(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
        limit: int = Query(5, title="Максимальное количество категорий")
):
    """
    Получить список рекомендованных для пользователя категорий активности
    """

    categories = [
        Category(
            title="Активность",
            description="Описание активности",
            picture=bytes(),
            season="круглый год",
            tags=["природа", "групповое"]
        ) for i in range(30)
    ]

    return categories[:limit]


@router.get(
    "/groups",
    response_description="Cписок групп рекомендованных для пользователя к посещению",
    response_model=List[Group],
)
async def get_groups(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
        category: str = Query(..., title="Название категории активности группы"),
        limit: int = Query(10, title="Максимальное количество групп")
):
    """
    Получить список групп рекомендованных для пользователя к посещению
    """
    groups = [
        Group(
            id=i,
            picture=bytes(),
            categories=["Категория 1", "Категория 2", "Категория 3"],
            title="Название группы",
            description="Описание группы",
            location=GroupLocation(
                address="Кутузовский пр-т, д.12",
                latitude=coords[0],
                longitude=coords[1],
                distance=130,
                isNear=(i % 2) * True
            ),
            schedule="c 01.01.2023 по 31.03.2023, Пн., Ср. 19:10-20:10, без перерыва",
        ) for i, coords in enumerate(
            [
                ("55.20706562984978", "37.94593950326013"),
                ("55.86855041314033", "37.36155286765391"),
                ("55.34577424039844", "37.670186830979645"),
                ("55.88889074079778", "37.198730692354296"),
                ("55.31711038790671", "38.17920437666176"),
                ("55.17867994869353", "37.79400134662748"),
                ("55.226553631776184", "37.962944682560085"),
                ("55.42049605263739", "37.43547946481265"),
                ("55.36156989471126", "37.56739921312038"),
                ("55.75511515102038", "37.26028522803187"),
                ("55.99360771448633", "37.07851660188896"),
                ("55.35676822563503", "37.565548910736645"),
                ("55.449365571233166", "38.02757622923665"),
                ("55.859383330669296", "37.10918248724443"),
                ("55.963619789417656", "37.69648168181478"),
                ("55.18072671001697", "37.364013473612715"),
                ("55.20754312658504", "37.86051515332559"),
                ("55.363891309299554", "37.99784189289955"),
                ("55.889154074651394", "37.7178806074676"),
                ("55.880274110844496", "37.59127079487411"),
                ("55.78089860214999", "37.79760744103567"),
                ("55.908383949599745", "37.263178143901"),
                ("55.236534620044175", "37.95758912929849"),
                ("55.95287869144896", "37.86607440160244"),
                ("55.94267366613092", "37.92395657508572"),
                ("55.460751070347854", "36.96868228007597"),
                ("55.59141755214558", "37.53953553996194"),
                ("55.24376110106233", "38.23315698063935"),
                ("55.27878865289917", "37.62376446384149"),
                ("55.46498429851375", "37.789240297182445")
            ]
        )
    ]

    return groups


@router.get(
    "/coldstart",
    response_description="Список вопросов для холодного старта",
    response_model=List[QuestionOptions],
)
async def get_coldstart_questions(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
        level: str = Query(0, title="Уровень категории определяемого направления активности"),
        amount: int = Query(5, title="Количество вопросов")
):
    """
    Получить список вопросов для холодного старта в зависимости от уровня категории активности
    """
    return [
        QuestionOptions(
            question="Как Вы относитесь к физической активности?",
            options=["Положительно", "Не очень положительно"]
        ),
        QuestionOptions(
            question="Какое физическое занятие Вам интересно?",
            options=["Прогулки", "Лечебная гимнастика", "Плавание"]
        ),
        QuestionOptions(
            question="Как Вы относитесь к творческой деятельности?",
            options=["Положительно", "Не очень положительно"]
        ),
        QuestionOptions(
            question="Какой вид творчества Вам интересен?",
            options=["Рисование, живопись", "Рукоделие, вышивка", "Музыка"]
        ),
        QuestionOptions(
            question="Как Вы относитесь к образованию?",
            options=["Положительно", "Не очень положительно"]
        ),
        QuestionOptions(
            question="Какой вид образования Вам интересен?",
            options=["Иностранный язык", "История искусств", "Экология"]
        ),
        QuestionOptions(
            question="Как Вы относитесь к танцам?",
            options=["Положительно", "Не очень положительно"]
        ),
        QuestionOptions(
            question="Какой стиль танцев Вам интересен?",
            options=["Бальные танцы", "Латина", "Степ"]
        )
    ]


@router.post(
    "/coldstart"
)
async def post_category_recommendation(
        user_id: int = Path(description="Уникальный идентификатор пользователя"),
        level: str = Query(..., title="Уровень категории направления активности"),
        answers: List[QuestionAnswer] = Body(..., title="Список объектов вопрос-ответ")
):
    """
    Задать направление для пользователя на основе результатов опроса
    """
    return JSONResponse(
        content={
            "message": f"Level {level} category of user {user_id} has been set"
        },
        status_code=200
    )
