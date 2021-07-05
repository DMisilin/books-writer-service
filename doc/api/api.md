## API

Программный интерфейс приложения

### TOC

- [API](#api)
    - [TOC](#toc)
        - [Methods](#methods)
            - [add-content](#addcontent)
                - [Description](#description)
                - [Input](#input)
                - [Output](#output)

#### Methods

События

##### add-content

Добавление контента

###### Description

Описание

Валидирует полученные параметры
Разбивает полученный текст на части согласно настройкам сервиса `  "content": {"minSize": xx, "maxSize": yy}`
Добавляем контент в БД

###### Input

Принимает параметры

- `data` - объект с параметрами:
    - `text` - *string* - текст
    - `hash`- [опционально] - *string* - хэш контента
    - `bookId` - *string* - идентификатор книги

###### Output

Отдаёт параметры

- `data` - объект с параметрами:
    - `result` - *Array<string>* - массив добавленных хэшей
