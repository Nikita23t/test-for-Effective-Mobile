### Тестовое заданрие для Effective Mobile

Тестовое задание сделано с использованием typescript, express.js, typeORM, postgreSQL

---

#### Как запустить приложение

**1. Создать и заполнить .env файл (из примера .env.example)**
**2. Создать в бд таблицу с соответствующим названием для .env**
**3. Сбилдить и запустить приложение:**
```bash
    npm i
    npm run build
    npm run start
```

---


### Запросы Postman для тестирования эндпоинтов:

---

#### 1. **Создать обращение**
- **Метод:** POST  
- **URL:** `http://localhost:PORT/`  
- **Тело (raw JSON):**
  ```json
  {
    "title": "Не работает кнопка",
    "message": "Кнопка 'Отправить' не реагирует на клики."
  }
  ```

---

#### 2. **Перевести обращение в статус «В процессе»**
- **Метод:** POST  
- **URL:** `http://localhost:PORT/work/:id`  
  (замените `id` на существующий индекс обращения)  
- **Тело:** Не требуется.

---

#### 3. **Завершить обращение**
- **Метод:** POST  
- **URL:** `http://localhost:PORT/complete/:id`  
  (замените `id` на существующий индекс обращения)  
- **Тело (raw JSON):**
  ```json
  {
    "resolutionText": "Исправлено в версии 2.1."
  }
  ```

---

#### 4. **Отменить обращение**
- **Метод:** POST  
- **URL:** `http://localhost:PORT/cancel/:id`  
  (замените `id` на существующий индекс обращения)  
- **Тело (raw JSON):**
  ```json
  {
    "reason": "Обращение уже устарело."
  }
  ```

---

#### 5. **Получить все обращения (с фильтрами по дате)**
- **Метод:** GET  
- **URL:**  
  - Без фильтров: `http://localhost:PORT/`  
  - Фильтр по одной дате: `http://localhost:PORT/?date=2023-10-01`  
  - Фильтр по диапазону: `http://localhost:PORT/?from=2023-10-01&to=2023-10-31`  

---

#### 6. **Отменить все обращения в статусе «В процессе»**
- **Метод:** POST  
- **URL:** `http://localhost:PORT/cancel-in-progress`  
- **Тело:** Не требуется.
