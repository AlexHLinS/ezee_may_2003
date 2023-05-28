from typing import Any
from requests import post, request, HTTPError
from requests.auth import HTTPBasicAuth
import json
from pprint import pprint
from openai import ChatCompletion, api_key
from pydantic import BaseModel

from .config import giga_apikeys, hobby_file_name, giga_token, giga_host, giga_model


class Payload(BaseModel):
    """ Описание объекта посылку """
    sex_male: bool = True
    age: int = 60
    health_issue: str
    sociality: str
    activity: str

class Answer(BaseModel):
    """ Формат ответа """
    recomendation: list 
    
class ErrorAnswer(BaseModel):
    """ Формат ответа при ошибке """
    status: int
    message: str

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
    hobbys_count: int = 3,
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
    print(f"type(anwers) {type(answers)}")
    print(f"len(answers) {len(answers)}")
    
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

async def send_prompt_to_giga(
    prompt:str, 
    token: str,
    previous_dialog: list = [],
    model: str = "GigaChat:v1.5.0",
    url: str = giga_apikeys['POST_chat']
    )->tuple:
    api_key = token
    messages = previous_dialog.copy()
    messages.append({"role":"user", "content": prompt})
   
    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": 0.85,
    })
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Contenr-Type": "application/json"
    }
    
    print(f">>> payload:\n{payload}")
        
    answer = ChatCompletion.create(model=model,
                                          messages=[
                                              {
                                                  "role": "user", 
                                                  "content": prompt
                                                  },
                                            ]
)
    
    return (200, answer.get("choices")[0].get("message").get("content"))

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
    print(f">>> decoded_answ: {ans}")
    return Answer(
        recomendation=ans
        )
    