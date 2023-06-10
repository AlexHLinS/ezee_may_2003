from random import random
import re
from random import random
from requests import post, request, HTTPError
from requests.auth import HTTPBasicAuth
import json
import openai as oi
from openai import ChatCompletion
from pydantic import BaseModel
import pandas as pd

from config import (
    giga_apikeys, hobby_file_name, giga_token, giga_host,
    giga_model, dict_excel_file_name
)


class Payload(BaseModel):
    """ Описание объекта посылку изначальных данных"""
    sex_male: bool = True
    age: int = 60
    health_issue: str
    sociality: str
    activity: str


class Payload_q2(BaseModel):
    """ Описание объекта на посылку ответов на вопрос 1 """
    history: list
    answers: dict
    '''sex_male: bool = True
    age: int = 60
    health_issue: str
    sociality: str
    activity: str'''


class Answer(BaseModel):
    """ Формат ответа """
    recomendation: list


class Answer_q1(BaseModel):
    """ Формат ответа на запрос вопросов """
    questions: dict
    history: list


class Answer_q2(BaseModel):
    """ Формат ответа рекомендаций активностей level3 """
    recomendations: list


class ErrorAnswer(BaseModel):
    """ Формат ответа при ошибке """
    status: int
    message: str


def get_level3_from_level2(
    level2_values: list,
    dict_xlsx_file: str,
    level2_column_caption: str = 'level2',
    level3_column_caption: str = 'leve3'
) -> str:
    """Получает список из level3 на основании конкретных level2"""
    act_names = pd.read_excel(dict_xlsx_file, engine='openpyxl')
    result = []
    for v in level2_values:
        filter_factor = act_names[level2_column_caption].str.lower(
        ).str.contains(v.lower())
        result.append(''.join(
            [s+'; ' for s in act_names[level3_column_caption][filter_factor].unique().tolist()]))
    return ''.join(r for r in result)


async def get_list_models(
        token: str,
        url: str = giga_apikeys["GET_list_models"]):
    """  Получение cписка доступных моделей """
    headers = {
        "Authorization": f"Bearer {token}",
    }
    result = request(
        method="GET",
        url=url,
        headers=headers,
    )
    return (result.status_code, result.text)


async def generate_prompt_get_qwest(
    hobby_list_file_name: str,
    sex_male: bool = True,
    age: int = 60,
    qwestions_count: int = 5,
    hobbys_count: int = 3,
) -> str:
    """  Генерация промпта для получения изначальных вопросов """
    sex = 'мужчина' if sex_male else 'женщина'
    result = f"Представь, что я {sex} {age} лет."
    # TODO: обработчик qwestions_count для правильного склонения
    result = f"{result} Задай мне {qwestions_count} вопросов,"
    result = f"{result} чтобы подобрать мне {hobbys_count} хобби,"
    result = f"{result} которые мне понравятся."
    result = f"{result} Варианты хобби ограничены следующим списком: "
    with open(hobby_list_file_name, "r", encoding="utf-8") as f:
        data = f.read().split("\n")
    for element in data:
        result = f"{result} {element}"
    result = f"{result} К каждому вопросу приведи 4 варианта ответа."
    result = f"{result} Обрати внимание, что варианты ответа, которые ты предлагаешь,"
    result = f"{result} должны быть быть перечислены через тире и заканчиваться символом '/'."

    return result


async def generate_prompt_fast(
    hobby_list_file_name: str,
    health_issue: str,
    sociality: str,
    activity: str,
    sex_male: bool = True,
    age: int = 60,
    hobbys_count: int = 5,
) -> str:
    """  Генерация промпта для получения рекомендаций """
    sex = 'мужчина' if sex_male else 'женщина'

    result = f"Представь, что я {sex} {age} лет. {health_issue} {sociality} {activity}"

    result = f"{result} Подобери мне {hobbys_count} хобби, которые мне понравятся. "
    result = f"{result} Варианты хобби ограничены следующим списком: "
    with open(hobby_list_file_name, "r", encoding="utf-8") as f:
        data = f.read().split("\n")
    for element in data:
        result = f"{result} {element}"

    result = f"{result} В ответе должен быть только список из {hobbys_count} вариантов хобби,"
    result = f"{result} разделенные символом ';'. Каждый вариант указать в кавычках. "
    result = f"{result} Кроме вариантов хобби не писать ничего."
    return result


async def generate_prompt_set_answers(
    hobby_list_file_name: str,
    answers: list | str,
    hobbys_count: int = 3,
) -> str:
    """  Генерация промпта для рекомендаций """
    result = "Вот мои ответы: "

    if type(answers) == list or len(answers) != 1:
        for i, answer in enumerate(answers):
            result = f"{result} {i+1}. {answer} "
    else:
        result = f"{result} {answers} "

    result = f"{result} Основываясь на этих ответах, выбери хобби, которые мне подойдут из списка ниже:"
    with open(hobby_list_file_name, "r", encoding="utf-8") as f:
        data = f.read().split("\n")
    for element in data:
        result = f"{result} {element}"

    result = f"{result} Обрати внимание, что ответ должен представлять с собой только {hobbys_count}"
    result = f"{result} хобби из списка выше, перечисленных через запятую."
    result = f"{result} Никакой другой инфорации в ответе быть не должно."
    return result


async def generate_prompt_first_neo(
    hobby_list_file_name: str,
    health_issue: str,
    sociality: str,
    activity: str,
    sex_male: bool = True,
    age: int = 60,
    hobbys_count: int = 3,
    quest_count: int = 5,
) -> str:
    """  Генерация промпта для получения рекомендаций шаг 1"""
    sex = 'мужчина' if sex_male else 'женщина'

    result = f"Представь, что я {sex} {age} лет. {health_issue} {sociality} {activity}"

    result = f"{result} Задайте мне {quest_count} вопросов, чтобы подобрать мне"
    result = f"{result} {hobbys_count} активности, которые мне понравятся. "
    result = f"{result} Варианты активностей ограничены следующим списком: "
    with open(hobby_list_file_name, "r", encoding="utf-8") as f:
        data = f.read().split("\n")
    for element in data:
        result = f"{result} {element}"

    result = f"{result} К каждому вопросу приведите 4 варианта ответа. "
    result = f"{result} В вопросе и в ответе не должны наименования хобби из списка выше. "
    result = f"{result} Каждый вопрос должен начинаться с 'question:' "
    result = f"{result} Каждый вопрос должен быть промаркирован "
    result = f"{result} Q 1, Q 2, Q 3 "
    result = f"{result} Каждый ответ должен быть промаркирован "
    result = f"{result} цифрой "
    result = f"{result} Обращение должно быть 'на Вы'. Варианты ответов должны быть на русском языке "
    return result


async def generate_prompt_third_neo(
    hobby_list: str,
    health_issue: str,
    sociality: str,
    activity: str,
    sex_male: bool = True,
    age: int = 60,
    hobbys_count: int = 3,
    quest_count: int = 2,
) -> str:
    """  Генерация промпта для получения рекомендаций шаг 1"""
    sex = 'мужчина' if sex_male else 'женщина'

    result = f"Представь, что я {sex} {age} лет. {health_issue} {sociality} {activity}"

    result = f"{result} Задайте мне {quest_count} вопросов, чтобы подобрать мне"
    result = f"{result} {hobbys_count} активности, которые мне понравятся. "
    result = f"{result} Варианты активностей ограничены следующим списком: {hobby_list}"
    result = f"{result} К каждому вопросу приведите 4 варианта ответа. "
    result = f"{result} В вопросе и в ответе не должны наименования хобби из списка выше. "
    result = f"{result} Каждый вопрос должен начинаться с 'question:' "
    result = f"{result} Каждый вопрос должен быть промаркирован "
    result = f"{result} Q1, Q2, Q3 "
    result = f"{result} Каждый ответ должен быть промаркирован цифрой "
    result = f"{result} Обращение должно быть 'на Вы'. Варианты ответов должны быть на русском языке "
    return result


async def generate_prompt_second_neo(
    answers: dict,
    activity_count: int = 5
) -> str:
    """  Генерация промпта для получения рекомендаций шаг 2"""

    result = "Мои ответы: "
    for answer in answers:
        result = f"{result}  вопрос: '{answer}' - ответ: '{answers[answer]}'"
    result = f"{result} Какие {activity_count} активностей из списка выше ,"
    result = f"{result} которые подойдут мне больше всего."
    result = f"{result} Названия активностей должны быть разделены точкой с запятой."
    result = f"{result} Перечисли только название активностей."

    return result


async def send_prompt_to_giga(
    prompt: str,
    token: str,
    previous_dialog: list = [],
    model: str = "GigaChat:v1.5.0",
    url: str = giga_apikeys['POST_chat']
) -> tuple:
    oi.api_key = token
    messages = previous_dialog.copy()
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.85,
    })

    headers = {
        "Authorization": f"Bearer {token}",
        "Contenr-Type": "application/json"
    }

    answer = ChatCompletion.create(model=model,
                                   messages=[
                                       {
                                           "role": "user",
                                           "content": prompt
                                       },
                                   ]
                                   )

    return (200, answer.get("choices")[0].get("message").get("content"))


async def send_prompt_to_giga_with_history(
    prompt: str,
    token: str,
    previous_dialog: list = [],
    history: list = [],
    model: str = "GigaChat:v1.5.0",
    url: str = giga_apikeys['POST_chat'],
) -> tuple:
    oi.api_key = token
    messages = previous_dialog.copy()
    messages.append({"role": "user", "content": prompt})

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.85,
    })

    headers = {
        "Authorization": f"Bearer {token}",
        "Contenr-Type": "application/json"
    }

    msg = history
    msg.append({"role": "user", "content": prompt})

    answer = ChatCompletion.create(model=model,
                                   messages=msg
                                   )

    msg.append(answer.get("choices")[0].get("message"))

    return (200, answer.get("choices")[0].get("message").get("content"), msg)


async def router(data: Payload) -> Answer | ErrorAnswer:
    """ Оценивает входящий пакет и принимает решение что запрашивать"""

    prompt = await generate_prompt_fast(
        hobby_list_file_name=hobby_file_name,
        health_issue=data.health_issue,
        sociality=data.sociality,
        activity=data.activity,
        sex_male=data.sex_male,
        age=data.age,
    )

    result = await send_prompt_to_giga(
        prompt=prompt,
        token=giga_token,
        url=giga_host,
        model=giga_model,
    )

    if result[0] != 200:
        return ErrorAnswer(status=result[0], message=(result[1]).encode('utf8'))
    ans = result[1].split(";")

    return Answer(
        recomendation=ans
    )


async def ask_q1(data: Payload) -> Answer_q1 | ErrorAnswer:
    """ 
    Оценивает входящий пакет на первый перечень вопрососв и ответов 
    и возвращает их
    """

    prompt = await generate_prompt_first_neo(
        hobby_list_file_name=hobby_file_name,
        health_issue=data.health_issue,
        sociality=data.sociality,
        activity=data.activity,
        sex_male=data.sex_male,
        age=data.age,
    )

    result = await send_prompt_to_giga_with_history(
        prompt=prompt,
        token=giga_token,
        url=giga_host,
        model=giga_model,
    )

    if result[0] != 200:
        return ErrorAnswer(status=result[0], message=(result[1]).encode('utf8'))

    questions = {}
    lst1 = result[1].split('Q')
    for _, val in enumerate(lst1):
        if len(val) > 1:
            sp = val.split('\n')
            questions[sp[0]] = [line for line in sp[1:5]]

    return Answer_q1(
        questions=questions,
        history=result[-1]
    )


async def ask_q2(data: Payload_q2) -> Answer_q2 | ErrorAnswer:
    """ Оценивает входящий пакет и принимает решение что запрашивать"""

    second_prompt = await generate_prompt_second_neo(
        answers=data.answers,
    )

    second_result = await send_prompt_to_giga_with_history(
        prompt=second_prompt,
        token=giga_token,
        url=giga_host,
        model=giga_model,
        history=data.history,
    )

    if second_result[0] != 200:
        return ErrorAnswer(status=second_result[0], message=(second_result[1]).encode('utf8'))

    t = re.sub('.*:\s(?=\w)', '', second_result[1])
    t = re.sub('\d.\s', '', t)
    pre_ans = t.replace('\n', '').replace('.', '').split(';')
    ans = [element.strip() for element in pre_ans]

    ans_txt = get_level3_from_level2(
        level2_values=ans,
        dict_xlsx_file=dict_excel_file_name
    )

    ans_txt = get_level3_from_level2(
        level2_values=ans, dict_xlsx_file=dict_excel_file_name)
    ans_list = ans_txt.split(";")

    recomendations = []

    for i in range(5):
        recomendations.append(ans_list[int(random()*len(ans_list))].strip())

    return Answer_q2(
        recomendations=recomendations,
    )
