# TELEGRAM BOT

Телеграм-бот для общения с чатом GPT.

## Возможности бота:

* Стримит ответы от нейросети чат GPT
* Сохраняет контекст диалога
* Имеет систему оплаты
* Выдерживает онлайн более 1000-чи пользователей при оперативке в 1гб

## Стек:

* Node.js
* CSS 
* HTML5
* Firebase
* ЮКасса
* OpenAI API

## Основные подходы:

* ООП - разбиение системы на компоненты.
* EventEmitter - для динамического программирования между модулями.
* Семафор - ограничение доступа к ресурсам нейросети, что бы не получить бан (1000 активных соединений)
* Структура данных очередь - для ведения учета активных соединений и их последовательной обработки.
* Чанкинизация сообщений - стриминг ответа нейронки что бы быстрее доставлять результат пользователю и не загружать оперативную память.
* Создал фейковый сервер нейросетки, который стримит заготовленный текст - для локальной разработки, что бы не тартить токены с боевой нейросети