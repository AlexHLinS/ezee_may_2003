import os
from requests import post
from requests.auth import HTTPBasicAuth


def get_giga_user_password_pair(file_name: str) -> tuple:
    """ Получает пару user:password из файла """
    with open(file_name, "r", encoding="utf-8") as f:
        result = tuple(f.readline().split(":"))
    return result


def get_token(user: str, password: str) -> tuple:
    """  Получение токена по паре user:password """
    auth = HTTPBasicAuth(user, password)
    answer = post(
        url=giga_apikeys["POST_token"],
        auth=auth,
    )
    result = answer.json()
    return result.get("tok"), 0


def get_token_(file_name: str) -> tuple:
    """  Получение токена из файла """
    with open(file_name, "r", encoding="utf-8") as f:
        tok = f.readline().replace("\n", "")
        host = f.readline().replace("\n", "")
        mod = f.readline().replace("\n", "")
    return tok, host, mod


giga_apikeys = {
    "entrypoint": "https://beta.saluteai.sberdevices.ru/v1/",
    "POST_token": "https://beta.saluteai.sberdevices.ru/v1/token",
    "GET_list_models": "https://beta.saluteai.sberdevices.ru/v1/models",
    "GET_retrive_models": "https://beta.saluteai.sberdevices.ru/v1/models/",
    "POST_chat": "https://beta.saluteai.sberdevices.ru/v1/chat/completions"
}

root_dir = os.getcwd()
hobby_file_name = f"{root_dir}/data/hobby.txt"
dict_excel_file_name = f"{root_dir}/data/dict.xlsx"
usr_pass_file = f"{root_dir}/data/gpt.token"

#_user, _passwrd = get_giga_user_password_pair(usr_pass_file)

giga_token, giga_host, giga_model = get_token_(usr_pass_file)
