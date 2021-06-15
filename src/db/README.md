## Конфигурация

Содержимое файла конфига:

```json
{
  "pg": {
    "driver": "pg",
    "host": "localhost",
    "database": "database_name",
    "schema": "schema_name",
    "user": "user",
    "password": "password",
    "port": 5432,
    "max": 10
  }
}
```

## Миграции

Перед запуском команд миграции необходимо перейти в текущую папку

**Создать новую миграцию**

```bash
db-migrate create [NAME] --config ./postgres.development.json -e pg -m ./migrations --sql-file
```

где `[NAME]` - название миграции.

**Применение миграций**
```bash
db-migrate up --config ./postgres.development.json -e pg -m ./migrations
```

**Откат миграций**

```bash
db-migrate down -c 1 --config ./postgres.development.json -e pg -m ./migrations
```

где `-с 1` на сколько назад в списке миграций сдвинуться.