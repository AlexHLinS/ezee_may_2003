# Сценарий 2

# Экран 1 (выбор пользователя)

## Получить список пользователей для демо

### GET /users/demo

#### Response Body:

```json
[
  {
    "id": int,
    "name": str,
    "surname": str,
    "birthdate": "27.05.2023",
    "coldStart": bool
  },
  {
    "id": int,
    "name": str,
    "surname": str,
    "birthdate": "27.05.2023",
    "coldStart": bool
  },
  {
    "id": int,
    "name": str,
    "surname": str,
    "birthdate": "27.05.2023",
    "coldStart": bool
  }
]
```

# Экран 2 (адрес, время на дорогу, расписание, болезни)

## Получить настройки пользователя

### GET users/{user_id}/settings

#### Response Body:

```json
{
  "location": {
    "address": str
    "latitude": str
    "longitude": str
  },
  "travelTime": int,
  "schedule": [
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    }
  ],
  "diseases": List[str]
}
```

## Обновить настройки пользователя

### PUT users/{user_id}/settings

#### Request Body:

```json
{
  "address": str
  "travelTime": int,
  "schedule": [
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    },
    {
      "morning": bool,
      "noon": bool,
      "evening": bool
    }
  ],
  "diseases": List[str]
}
```

# Экран 3 и 4 ("Вам подойдут" и карта)

## Получить рекомендации категорий активности для пользователя

### GET /users/{user_id}/recommendations/categories

#### Request Params:
> - limit: Optional[int] = 5 - кол-во категорий активности, которые необходимо получить  
> > Пример:  
> > GET /users/{user_id}/recommendations/categories?limit=10 вернет топ-10 категорий

#### Response Body:

```json
[
{
  "title": str,  # Скандинавская ходьба
  "description": str,  # Когда ходишь с палками,
  "picture": bytes,
  "season": str,  # "весна"/"лето"/"осень"/"зима"/"круглый год"
  "tags": List[str]  # ["природа", "групповое", "новое"]
},
  {
  "title": str, # Скандинавская ходьба
  "description": str, # Когда ходишь с палками, 
  "picture": bytes,
  "season": str,  # "весна"/"лето"/"осень"/"зима"/"круглый год"
  "tags": List[str]  # ["природа", "групповое", "новое"]
}
]
```

## Получить рекомендации по группам для пользователя в зависимости от категории

### GET /users/{user_id}/recommendations/groups

#### Request Params:
> - category: str - название категории активностей
> - limit: Optional[int] = 10  - кол-во групп, которые необходимо получить
> > Пример:  
> > GET /users/{user_id}/recommendations/groups?limit=10&title="Скандинавская ходьба" вернет топ-10 групп в категории "Скандинаская ходьба"

#### Response Body:

```json
[
{
  "id": int,
  "picture": bytes,
  "categories": List[str],  # ["Образование", "Информационные технологии", "Курсы компьютерной грамотности"]
  "title": str,
  "description": str,
  "location": {
    "address": str,
    "latitude": str,
    "longitude": str,
    "distance": str,
    "isNear": bool,
  },
  "schedule":  str,  # "c 01.01.2023 по 28.02.2023, Чт. 12:00-14:00, без перерыва; c 01.09.2022 по 31.12.2022, Чт. 12:00-14:00, без перерыва"
  "tags": List[str]  # ["природа", "групповое", "новое"],
}, 
  {
  "id": int,
  "picture": bytes,
  "categories": List[str],  # ["Образование", "Информационные технологии", "Курсы компьютерной грамотности"]
  "title": str,
  "description": str,
  "location": {
    "address": str,
    "latitude": str,
    "longitude": str,
    "distance": str,
    "isNear": bool,
  },
  "schedule":  str,  # "c 01.01.2023 по 28.02.2023, Чт. 12:00-14:00, без перерыва; c 01.09.2022 по 31.12.2022, Чт. 12:00-14:00, без перерыва"
  "tags": List[str]  # ["природа", "групповое", "новое"],
},
]
```


# Сценарий 1


## Получить список вопросов для холодного старта пользователя

### GET /users/{user_id}/recommendations/coldstart

#### Request Params:
> - level: int - уровень направления, которое нужно определить; 0 - направление 1, 1 - направление 2, итд.  
> - amount: Optional[int] = 5 - кол-во вопросов, которое будет сгенерировано

#### Response Body:
```json
[
  {
    "question": str,
    "options": List[str] # варианты ответов
  },
  {
    "question": str,
    "options": List[str] # варианты ответов
  },
  {
    "question": str,
    "options": List[str] # варианты ответов
  }
]
```

## Задать направление для пользователя на основе результатов опроса

### POST /users/{user_id}/recommendations/coldstart

#### Request Params:
> - level: int - уровень направления, которое нужно задать; 0 - направление 1, 1 - направление 2, итд.

#### Request Body:
```json
[
  {
    "question": str,
    "answer": str
  },
  {
    "question": str,
    "answer": str
  },
  {
    "question": str,
    "answer": str
  },
  {
    "question": str,
    "answer": str
  },
  {
    "question": str,
    "answer": str
  }
]
```