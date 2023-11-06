# NestAPI

API backend service with RESTful and GrapQL based on Nest.js, TypeORM, Apollo

Этот бэк предоставляет уже готовые базовые возможности:

- управление регистрацией и авторизацией пользователей,
- получение и обработка файлов, в т.ч. изображений,
- работа с базой данных,
- RestAPI и GraphQl в любом сочетании по выбору.

Для примера бэк уже содержит несколько базовых сущностей. Обычно они нужны в любой системе в том или ином виде, так что вы можете использовать их не только в качестве примера, но и для работы.

# Оглавление

- [Установка](#установка)
- [Запуск](#запуск)
- [Настройка](#настройка)
  - [Настройки сервера](#настройки-сервера)
  - [Настройки токенов](#настройки-токенов)
  - [Настройки базы данных](#настройки-базы-данных)
  - [Настройки GraphQl](#настройки-graphql)
  - [Настройки почты](#настройки-почты)
  - [Настройки passport](#настройки-passport)
- [Пользователи](#пользователи)
  - [Авторизация пользователей](#авторизация-пользователей)
- [Базовые сущности](#базовые-сущности)
  - [Типы сущностей](#типы-сущностей)
  - [Расширение типов сущностей](#расширение-типов-сущностей)
- [Отношения](#отношения)
- [Модели данных](#модели-данных)
- [Контроллеры и резолверы](#контроллеры-и-резолверы)
  - [Аргументы](#аргументы)
- [Сервисы](#сервисы)
  - [Связи в сервисах](#связи-в-сервисах)
  - [Объединение сервисов](#объединение-сервисов)
- [Методы](#методы)
  - [Метод getAll](#метод-getall)
  - [Метод getOne](#метод-getone)
  - [Метод getMany](#метод-getmany)
  - [Метод filter, поддерживает опции](#метод-filter,-поддерживает-опции)
  - [Метод search, поддерживает опции](#метод-search,-поддерживает-опции)
  - [Метод create](#метод-create)
  - [Метод update](#метод-update)
  - [Метод remove](#метод-remove)
  - [Опции](#опции)
    - [Опции фильтрации](#опции-фильтрации)
    - [Опции группировки](#опции-группировки)
    - [Опции технически](#опции-технически)
- [Работа с файлами](#работа-с-файлами)
  - [filesSave](#filessave)
  - [filesRename](#filesrename)
  - [filesMaxSize](#filesmaxsize)
  - [filesAllowTypes](#filesallowtypes)
  - [filesIsImage](#filesisimage)
  - [filesImageMetadata](#filesimagemetadata)
  - [filesImageResize](#filesimageresize)
  - [filesImageOversize](#filesimageoversize)
  - [convertToWebp](#converttowebp)
  - [filesImageConvert](#filesimageconvert)
  - [Интерфейс файла](#интерфейс-файла)
- [Работа с базой данных](#работа-с-базой-данных)

# Установка

Выполните клонирование данного репозитория в ваш проект на локальном компьютере:

```shell script
git clone https://github.com/isengine/nestapi
```

или в текущий каталог вашего проекта:

```shell script
git clone https://github.com/isengine/nestapi .
```

Для сборки и запуска проекта мы рекомендуем использовать менеджер **npm**.

```shell script
npm install
```

# Запуск

Для сборки и запуска в режиме разработки, выполните:

```shell script
npm run dev
```

Для сборки в режиме **production**, выполните:

```shell script
npm run build
```

Для **production** мы рекомендуем использовать менеджер процессов **pm2**.

Запуск процесса:

```shell script
pm2 start dist/main.js --name nestapi
```

Перезапуск процесса:

```shell script
pm2 reload nestapi
```

Остановка процесса:

```shell script
pm2 stop nestapi
```

Мониторинг процессов:

```shell script
pm2 monit
```

Просмотр логов:

```shell script
pm2 logs nestapi --lines 1000
```

Очистить все процессы:

```shell script
pm2 kill
```

Для запуска без **pm2**, выполните:

```shell script
npm run prod
```

# Настройка

Настройка бэка производится переменными окружения, которые лежат в файле **.env**. Этот файл небезопасно хранить в репозитории, поэтому мы предлагаем файл с примерным содержанием настроек **.env.example**.

Переименуйте или скопируйте файл **.env.example** в **.env**, а затем настройте его под ваш проект.

Некоторые настройки предусматривают значения вкл/выкл. В этом случае для включения можно использовать значение **true**, а для выключения оставить поле пустым.

Этот файл условно разделен на несколько частей.

[^ к оглавлению](#оглавление)

## Настройки сервера

- NODE_ENV - задает режим работы: **development** или **production**,
- PORT - порт, на котором будет запускаться бэк, по-умолчанию **5000**,
- DOMAIN - адрес домена, по-умолчанию **http://localhost**
- PREFIX - здесь вы можете задать глобальный префикс, например **api** и тогда бэк будет доступен по адресу **http://localhost/api**,
- UPLOADS - папка для загрузки файлов в корневом каталоге, по-умолчанию **uploads**,
- SESSION_SECRET - здесь должна быть любая строка из случайного количества символов, которая является ключом для механизма сессий.

[^ к оглавлению](#оглавление)

## Настройки токенов

- JWT_ACCESS_SECRET - любая строка из случайных символов, является солью для токена доступа,
- JWT_ACCESS_EXPIRES - время действия токена доступа,
=15m
- JWT_REFRESH_SECRET - любая строка из случайных символов, является солью для токена обновления,
- JWT_REFRESH_EXPIRES - время действия токена обновления.

[^ к оглавлению](#оглавление)

## Настройки базы данных

- DB_TYPE - тип базы данных,
- DB_HOST - хост,
- DB_NAME - имя базы данных,
- DB_USER - имя пользователя для подключения к базе данных,
- DB_PASSWORD - пароль для подключения к базе данных,
- DB_PORT - порт, на котором доступна база данных,
- DB_SYNCHRONIZE - автоматическая синхронизация базы данных со схемой **TypeORM**, по-умолчанию включена, рекомендуем отключать в **production**.

В файле **.env.example** имеются базовые настройки для подключения к базе данных **MySql** и **Postgres**.

[^ к оглавлению](#оглавление)

## Настройки GraphQl

- GQL_ENABLE - разрешает использовать GraphQL,
- GQL_PLAYGROUND - разрешает использовать песочницу, которая доступна по адресу **graphql**.

По-умолчанию обе настройки влючены.

[^ к оглавлению](#оглавление)

## Настройки почты

- SMTP_HOST - хост для почты,
- SMTP_PORT - порт для почты,
- SMTP_USER - имя пользователя для подключения к почте,
- SMTP_PASSWORD - пароль для подключения к почте,
- SMTP_SECURE - режим защищенности почты.

[^ к оглавлению](#оглавление)

## Настройки passport

Здесь хранятся различные настройки, которые вы должны взять из своих аккаунтов на сервисах типа Google authentication.

[^ к оглавлению](#оглавление)

# Пользователи

Обычно в системах данные пользователей и данные авторизации/аутентификации хранятся в одной таблице. В данном случае это две совершенно разные сущности.

Данные авторизации/аутентификации хранятся в таблице **auth**. Для работы с этими данными есть свои декораторы, DTO-шки, интерфейсы, стратегии, сервисы и пр., а также свой модуль с контроллером.

Такое разделение позволяет изолировать данные авторизации от прочих данных пользователя, а также все методы работы с ними.

Например, вы можете разрешить авторизацию по телефону и email. Вам не нужно заморачиваться с безопасностью и возможностью разделения этих данных для авторизации и для хранения в качестве контактной информации пользователя.

Также вы можете работать над авторизацией изолированно от прочих данных пользователя. Это относится, например, к реализации прав, авторизации по OAuth или OpenID и т.д.

[^ к оглавлению](#оглавление)

## Авторизация пользователей

У нас реализована авторизация с двумя jwt токенами, авторизация через google и механизм сессий.

Для контроллера у нас есть декоратор **@Auth**, который разрешает доступ только авторизованному пользователю. В этом декораторе можно указывать группу прав. Например:

    @Auth('admin')

Для пользователей у нас есть декоратор **@Self**. Например:

    ...(@Self() id: number) {...}

Его использование позволяет управлять данными именно того пользователя, от которого идет запрос.

Пользователи **users** и данные авторизации **auth** связаны между собой отношением один-к-одному по полю **id** (**auth.id**).

Предполагается, что пользователь не может просто так получить свои данные авторизации, но система позволяет их поменять. Примером такой реализации служит пароль.

[^ к оглавлению](#оглавление)

# Базовые сущности

- categories - категории или разделы постов
- posts - посты
- tags - теги для постов

Каждая сущность имеет базовые поля, такие как:

- bigint
- date
- enum
- int
- text
- timestamp
- varchar

[^ к оглавлению](#оглавление)

## Типы сущностей

У каждой сущности есть несколько типов:

- controller
- DTO
- entity
- module
- resolver
- service

Дополнительными типами могут быть:

- decrator
- enum
- group
- interface

Также вы можете создать любой нужный вам тип.

Каждый тип сущности представлен в файле, который имеет условный шаблон **сущность.тип.ts**.

[^ к оглавлению](#оглавление)

## Расширение типов сущностей

Один тип сущности может отвечать как за один метод, так и объединять несколько методов общего вида или значения.

Если вы хотите расширить сущность, вам нужно решать, что лучше:

- создать новый тип,
- расширить существующий тип.

Если вы хотите создать собственные кастомные типы, предлагаем сделать это в отдельном файле, например **сущность.custom.тип.ts**.

Если типов много, вы можете положить их в отдельную папку. Например:

    сущность
        тип
            сущность.first.тип.ts
            сущность.second.тип.ts

> Не забудьте в этом случае следить за импортами!

[^ к оглавлению](#оглавление)

# Отношения

Посты по-умолчанию являются базовой единицей. Каждый пост привязан к какому-либо автору, поэтому посты связаны с пользователями отношением многие-к-одному.

Также посты могут относится к какой-либо категории, предполагается, что только к одной. Поэтому посты связаны с категориями тоже отношением многие-к-одному.

А вот тегов посты могут иметь несколько. И посты связаны с тегами отношением многие-ко-многим.

Для такой связи предусмотрено создание отдельной таблицы **posts_by_tags**.

Любые подобные отношения предполагают взаимное изменение и удаление. Например, пост может поменять категорию, а при удалении категорий, удалятся все посты, которые входят в нее.

Все отношения прописаны в файлах **entity**.

Вы можете поменять существующие отношения или добавить новые.

[^ к оглавлению](#оглавление)

# Модели данных

Модель данных в **TypeORM** автоматически формирует базу данных с необходимыми полями и связями. Также на ее основе автоматически генерируется схема GraphQl. Такие модели представлены файлами с расширением **.entity.ts**.

Также мы использем DTO - классы описания данных, которые используются для типизации передаваемых данных к сервисам. Такие модели данных представлены файлами с расширением **.dto.ts**.

Все модели данных наследуют базовый класс, который содержит поля:

- id
- createdAt
- updatedAt

Для TypeORM это:

    src/typeorm/entity/common.entity.ts

Для DTO это:

    src/typeorm/entity/common.dto.ts

[^ к оглавлению](#оглавление)

# Контроллеры и резолверы

Контроллеры используются для запуска методов RestAPI. Контроллеры представлены файлами с расширением **.controller.ts**.

Для GraphQl вместо контроллеров используются резолверы. Они представлены файлами с расширением **.resolver.ts**.

Контроллеры и резолверы мы рекомендуем использовать в качестве обертки, а сам функционал реализовывать в сервисах.

[^ к оглавлению](#оглавление)

## Аргументы

Мы сделали так, что контроллеры и резолверы используются максимально похоже.

Резолверы принимают аргументы через переменные GraphQl запроса, а контроллеры - через тело запроса. В обоих случаях аргументы имеют формат **JSON**.

Например, для условного запроса **getOne**, требуется аргумент **id**. Для контроллера и резолвера он будет передан одинаково:

    {
        "id": 1
    }

[^ к оглавлению](#оглавление)
    
# Сервисы

Сервисы представляют собой классы, которые реализуют код сервисных функций. Они представлены файлами с расширением **.service.ts**.

Сервисы реализуют методы, которые перечислены в соответствующем разделе.

Однако, могут возникнуть ситуации, когда некоторые методы окажутся для вас избыточными. В таком случае, вы можете просто удалить их из контроллера и резолвера.

[^ к оглавлению](#оглавление)

## Связи в сервисах

По-умолчанию связи в сервисах задаются константой, которая одинаково работает для всех методов внутри этого сервиса.

Например:

    const relations = ['category', 'tags'];

Такие связи для постов позволяют получить категорию поста и все его теги в виде вложенного объекта и массива объектов соответственно.

Вы можете даже использовать многоуровневые связи типа **post.category...**, но только если вложенные сущности не дублируют исходную сущность.

Многоуровневые связи типа **post.category.posts** создавать нельзя из-за возникновения перекрестного объединения сущностей.

[^ к оглавлению](#оглавление)

## Объединение сервисов

Чтобы объединять сервисы одной сущности, в файле **.module.ts** источника запровайдите их таким образом:

    @Module({
        ...
        providers: [PostsService, PostsCustomService],
        ...
    })

Возможно, вам также понадобится объединять сервисы разных сущностей.

Для этого в файле **.module.ts** источника импортируйте модули источника целиком:

    @Module({
        ...
        imports: [
            ...
            forwardRef(() => TestsModule),
        ],
        ...
    })

> Не забудьте импортировать **forwardRef** из библиотеки **@nestjs/common**!

После в сервисе получателя, в конструкторе, объявите сервисы источника таким образом:

    constructor(
        @InjectRepository...
        private readonly testsService: TestsService,
    ) {}

Важно следить за тем, чтобы не получилось перекрестного объединения, когда источник попадает в получателя, но получатель при этом является источником для своего источника.

[^ к оглавлению](#оглавление)

# Методы

Мы предлагаем реализацию базовых методов для каждой сущности, что покрывает 90% всех потребностей.

Методы условно разбиты на три группы:

- стандартные методы получения данных
- расширенные методы получения данных, такие как поиск, сортировка и группировка
- методы изменения данных

Эти методы:

- get all - получить все записи
- get one - получить одну запись по id
- get many - получить несколько записей по списку id
- filter - найти записи, поля которых соответствуют заданным условиям
- search - поиск по записям, которые имеют заданные совпадения в заданных полях
- create - создать новую запись
- update - обновить запись
- remove - удалить запись

Важно учитывать, что в сервисах и резолверах эти методы имеют впереди название сущности и пишутся в стиле camelCase. Например:

    postsGetAll

В контроллерах эти методы записываются в стиле snake_case. Название сущности задается в имени контроллера. Например:

    get_all
    /posts/get_all

Далее следует подробная реализация данных методов.

[^ к оглавлению](#оглавление)

## Метод getAll

Получить все записи

RestAPI:

    GET get_all

GraphQl:

    query getAll {
        result: getAll {
            ...
        }
    }

Параметры:

    нет

Ответ:

    {
        "data": {
            "result": [
                {
                    ...
                },
                ...
            ]
        }
    }

В ответ попадает массив записей с запрошенными полями.

[^ к оглавлению](#оглавление)

## Метод getOne

Получить одну запись по id

RestAPI:

    GET get_one

GraphQl:

    query getOne($id: Float!) {
        result: getOne(id: $id) {
            ...
        }
    }

Параметры:

    {
        "id": ...
    }

Ответ:

    {
        "data": {
            "result": {
                ...
            }
        }
    }

В ответ попадает одна запись с запрошенными полями.

[^ к оглавлению](#оглавление)

## Метод getMany

Получить несколько записей по списку id

RestAPI:

    GET get_many

GraphQl:

    query getMany($ids: GetManyDto!) {
        result: getMany(ids: $ids) {
            ...
        }
    }

Параметры:

    {
        "ids": [...]
    }

Ответ:

    {
        "data": {
            "result": [
                {
                    ...
                },
                ...
            ]
        }
    }

В ответ попадает массив записей с запрошенными полями.

[^ к оглавлению](#оглавление)

## Метод filter, поддерживает опции

Найти записи, поля которых соответствуют заданным условиям

RestAPI:

    GET filter

GraphQl:

    query filter($filter: ...Dto!, $options: OptionsDto!) {
        result: filter(filter: $filter, options: $options) {
            count
            group
            pages
            list {
                ...
            }
        }
    }

Параметры:

    {
        "filter": {
            ...
        },
        "options": {
            "order": "id",
            "desc": false,
            "skip": 0,
            "limit": 10,
            "page": 1,
            "group": "field",
            "type": ""
        }
    }

Ответ:

    {
        "data": {
            "result": [
                {
                    "count": ...,
                    "pages": ...,
                    "group": ...,
                    "list": [
                        { ... },
                        ...
                    ]
                },
                ...
            ]
        }
    }

В параметрах **filter** вы можете указывать поля и разные запросы по их поиску и фильтрации в качестве значений.

Например:

    "filter": {
        "title": "like '%слово%'"
    }

Если в значениях нужно использовать название поля, рекомендуем писать **{alias}**. Например:

    "filter": {
        "id": ">= 20 and {alias} <= 100"
    }

Вы также можете фильтровать поля отношений. Например:

    "filter": {
        "category": {
            "title": "like '%слово%'"
        }
    }

Параметры **options.group** и **options.type** позволяют найти записи и сгруппировать их по заданному полю.

> Этот метод поддерживает опции, подробнее см. ниже

Чтобы этот метод работал корректно, вам нужно расширить стандартный тип **FilterType** записью вашей сущности. Например:

    import { ObjectType } from '@nestjs/graphql';
    import { ...Entity } from '@src/.../....entity';
    import { FilterType } from '@src/typeorm/types/filter.type';

    @ObjectType()
    export class ...Filter extends FilterType(...Entity) {}

Вы можете посмотреть, как реализованы файлы  **сущность.filter.ts**.

[^ к оглавлению](#оглавление)

## Метод search, поддерживает опции

Поиск по записям, которые имеют заданные совпадения в заданных полях

RestAPI:

    GET search

GraphQl:

    query search($search: SearchDto!, $options: OptionsDto!) {
        result: search(search: $search, options: $options) {
            count
            group
            pages
            list {
                ...
            }
        }
    }

Параметры:

    {
        "search": {
            "string": "value",
            "array": ["value1", "value2"],
            "fields": ["field1", "field1"]
        },
        "options": {
            "order": "id",
            "desc": false,
            "skip": 0,
            "limit": 10,
            "page": 1,
            "group": "field",
            "type": ""
        }
    }

Ответ:

    {
        "data": {
            "result": [
                {
                    "count": ...,
                    "pages": ...,
                    "group": null,
                    "list": [
                        { ... },
                        ...
                    ]
                }
            ]
        }
    }

Для корректной работы нужно задать только один из параметров **search.string** или **search.array**.

> Этот метод поддерживает опции, подробнее см. ниже

[^ к оглавлению](#оглавление)

## Метод create

Создать новую запись

RestAPI:

    GET create

GraphQl:

    mutation create($create: ...Dto!) {
        result: create(create: $create) {
            ...
        }
    }

Параметры:

    {
        "create": {
            ...
        }
    }

Ответ:

    {
        "data": {
            "result": {
                ...
            }
        }
    }

В результат попадают запрошенные поля.

[^ к оглавлению](#оглавление)

## Метод update

Обновить запись

RestAPI:

    GET update

GraphQl:

    mutation update($update: ...Dto!) {
        result: update(update: $update) {
            ...
        }
    }

Параметры:

    {
        "update": {
            ...
        }
    }

Ответ:

    {
        "data": {
            "result": {
                ...
            }
        }
    }

В результат попадают запрошенные поля.

[^ к оглавлению](#оглавление)

## Метод remove

Удалить запись

RestAPI:

    GET remove

GraphQl:

    mutation remove($id: Float!) {
        result: remove(id: $id)
    }

Параметры:

    {
        "id": ...
    }

Ответ:

    {
        "data": {
            "result": ...
        }
    }

В результат попадает число удаленных записей. Если ни одна запись не удалена, в результате будет **0**.

[^ к оглавлению](#оглавление)

## Опции

Есть методы, которые поддерживают опции.

К опциям относятся:

- order - сортировка по полю,
- desc - сортировка в обратном порядке,
- skip - пропустить какое-то количество записей,
- limit - получить только указанное количество записей,
- page - номер страницы,
- group - поле, по которому записи будут сгруппированы,
- type - тип группировки.

Если не указывать опции, то эти методы будут выводить все найденные записи в **list** с подсчетом из числа в **count**.

[^ к оглавлению](#оглавление)

### Опции фильтрации

Если вы задаете поле **limit**, то автоматически включается поддержка страниц **page**. Например, вы можете указать лимит 10 записей, и по-умолчанию вам будут выданы записи с 1 по 10.

Но если вы укажете страницу 2, то вам будут выданы записи с 11 по 20.

Также в ответе вам будет выдано общее число страниц **pages**.

Независимо от опций фильтрации, в ответе вам будет выдано общее число записей **count**. На данные этого счетчика не влияют **skip**, **limit** и **page**.

[^ к оглавлению](#оглавление)

### Опции группировки

Группировка - еще одна интересная вещь. Вы можете сгруппировать данные по какому-либо полю. Причем в указании поля поддерживаются отношения. Например **title** и **category.title**.

В случае с имеющимися отношениями, такая группировка может быть необоснована. Например, вы можете получить записи по категориям, запросив категории со вложенным массивом записей.

Однако, если вы хотите группировать записи по другому признаку, например по какому-либо полю, например, по дате создания, такая группировка может помочь.

Также группировка может помочь избежать создания перекрестных отношений.

В типе группировки вы можете указать следующие значения:

- string - строка,
- number - число,
- boolean - булев тип, true/false,
- другое - дата.

Если указать любое другое значение, то оно будет распознано как формат даты. Например **YYYY.MM.DD**.

> Для преобразования дат используется библиотека **moment.js**. 

Указывая тип, значение поля будет принудительно приведено к этому типу.

Если значение не указывать, то тип останется таким же, как в оригинальном поле.

В случае применения группировки, в ответе будет массив из нескольких объектов, у каждого из которых в поле **group** будет значение поля группировки.

Например, ответ без группировки:

    {
        "data": {
            "result": [
                {
                    "count": ...,
                    "group": null,
                    "list": [
                        { ... },
                        ...
                    ]
                }
            ]
        }
    }

Например, ответ с группировкой:

    {
        "data": {
            "result": [
                {
                    "count": ...,
                    "group": "...",
                    "list": [
                        { ... },
                        ...
                    ]
                },
                {
                    "count": ...,
                    "group": "...",
                    "list": [
                        { ... },
                        ...
                    ]
                },
                ...
            ]
        }
    }

В ответе вам также будет выдано число записей **count**, но для каждой группы отдельно.

Вы можете использовать вместе с группировкой и другие опции, но будьте осторожны, т.к. результат может оказаться не тем, который вам нужен.

Например, в группы не попадут записи по лимитам, а сортировка групп будет происходить на основе сортировки записей. Если сортировку не указать принудительно, то сортировка будет идти по тому же полю, что и группировка.

> Для сортировки групп в обратном порядке, рекомендуем указывать только опцию **desc: true**.

[^ к оглавлению](#оглавление)

### Опции технически

Поля опций заданы в файле **src/typeorm/dto/options.dto.ts**.

Сервисные функции, которые обрабатывают эти поля, заданы в файле **src/typeorm/services/options.service.ts**.

Чтобы не вызывать каждую функцию отдельно, мы включили сервисную функцию **optionsService**, которая, собственно подготавливает объект опций.

Кроме этого, она также вызывает репозиторий **typeorm** на выполнение, поэтому она требует передать ей репозиторий в качестве одного из аргументов.

Другими словами, **optionsService** подготавливает запрос, выполняет его и возвращает результат.

[^ к оглавлению](#оглавление)

# Работа с файлами

На текущий момент загрузка файлов возможна только через контроллер. Резолверы не поддерживаются.

Контроллер **files** реализует только один метод **upload**, который поддерживает query-параметр **folder**.

Этот параметр нужен для того, чтобы загружать файл во вложенную папку. Однако, поддерживается только один уровень вложений, чтобы сделать простую структуру хранения файлов.

Изначальная папка для загрузки файлов задается в **.env** файле, в параметре **UPLOADS**.

Метод позволяет загружать несколько файлов одновременно, устанавливать максимально допустимый размер и разрешенные типы файлов.

Кроме того, метод конвертирует изображения в формат **webp**, ужимая большие до заданных пределов с сохранением соотношения сторон.

> для работы с изображениями используется библиотека **sharp**.

В качестве результата выдается массив с расширенной информацией о каждом файле:

- url - ссылка на файл,
- originalname - имя файла,
- mimetype - mime-тип,
- size - размер в байтах.

Для работы с файлами, вы можете построить свои контроллеры, используя существующие сервисные функции.

[^ к оглавлению](#оглавление)

## filesSave

Сохраняет файлы в заданную вложенную папку.

В случае ошибки при записи файла, выбрасывает исключение.

Принимает аргументы:

- массив экземпляров интерфейса,
- вложенную папку (строка), необязательный.

Возвращает массив экземпляров интерфейса.

[^ к оглавлению](#оглавление)

## filesRename

Дает файлу новое имя в виде случайно сгенерированного набора символов по стандарту **uuid** версии 4.

Принимает аргументы:

- экземпляр интерфейса,
- расширение (строка), необязательный.

Возвращает экземпляр интерфейса.

[^ к оглавлению](#оглавление)

## filesMaxSize

Вычисляет, соответствует ли файл заданному размеру.

Если размер не указан или равен 0, то файл всегда будет соответствовать.

Принимает аргументы:

- экземпляр интерфейса,
- максимальный размер (число), необязательный.

Возвращает true/false.

[^ к оглавлению](#оглавление)

## filesAllowTypes

Вычисляет, соответствует ли файл заданному типу.

Тип может быть указан как один из mime-типов, либо его часть, либо массив.

Например:

    'jpeg'
    'image/jpeg'
    'image/*'
    'image'
    ['jpeg', 'png', 'webp']
    ['audio', 'image', 'video']

Если тип не указан, то файл всегда будет соответствовать.

Принимает аргументы:

- экземпляр интерфейса,
- типы (строка или массив строк), необязательный.

Возвращает true/false.

[^ к оглавлению](#оглавление)

## filesIsImage

Вычисляет, является ли файл изображением.

Работает по mime-типу файла.

Принимает аргументы:

- экземпляр интерфейса.

Возвращает true/false.

[^ к оглавлению](#оглавление)

## filesImageMetadata

Возвращает метаданные изображения.

Работает через библиотеку **sharp**.

Принимает аргументы:

- буфер.

Возвращает метаданные.

[^ к оглавлению](#оглавление)

## filesImageResize

Меняет размер изображения, ширину и высоту.

В качестве опций можно указать объект:

    {
        width,
        height,
        fit,
        position,
        background,
        kernel
    }

Работает через библиотеку **sharp**.

Подробнее обо всех параметрах можно узнать в документации на библиотеку.

Принимает аргументы:

- буфер,
- опции.

Возвращает буфер.

[^ к оглавлению](#оглавление)

## filesImageOversize

Меняет размер изображения если оно превышает заданные ширину или высоту.

Сохраняет соотношение сторон.

В качестве опций можно указать объект:

    {
        width,
        height
    }

Работает через функцию **filesImageResize**.

Принимает аргументы:

- буфер,
- опции.

Возвращает буфер.

[^ к оглавлению](#оглавление)

## convertToWebp

Конвертирует изображение в формат **webp**.

Работает через библиотеку **sharp**.

Принимает аргументы:

- буфер.

Возвращает буфер.

[^ к оглавлению](#оглавление)

## filesImageConvert

Конвертирует все изображения, кроме **svg**, в формат **webp**.

Работает через функцию **convertToWebp**.

Принимает аргументы:

- буфер.

Возвращает экземпляр интерфейса.

[^ к оглавлению](#оглавление)

## Интерфейс файла

Вся работа с файлами ведется через интерфейс, который содержит следующие поля:

- buffer - буфер с содержимым файла, необязательное,
- originalname - имя файла,
- mimetype - mime-тип файла,
- url - ссылка на файл, необязательное,
- size - размер в байтах, необязательное,
- width - ширина, только для изображений, необязательное,
- height - высота, только для изображений, необязательное.

Интерфейс создается через конструктор класса, который принимает файл в формате **Express.Multer.File** или экземпляр интерфейса.

[^ к оглавлению](#оглавление)

# Работа с базой данных

Для работы с базой данных мы используем библиотеку **TypeORM**.

Она позволяет синхронизировать изменения в БД, а также гибко управлять миграциями.

Возможно, в режиме разработки вам это не понадобится, но это станет необходимым при синхронизации изменений в локальной и **production** базах данных, а также при выключенной автоматической синхронизации в **.env** файле, в параметре **DB_SYNCHRONIZE**.

Для всего процесса миграции мы задали скрипты, которые еще больше автоматизируют весь процесс.

В начале работы вам наверняка потребуется сделать первую миграцию. Для этого используйте:

```shell script
npm run migration:fake
```

Далее, чтобы создать миграцию, выполните:

```shell script
npm run migration:auto
```

Запустить ее вы можете так:

```shell script
npm run migration:run
```

Откатить миграцию вы можете так:

```shell script
npm run migration:revert
```

Помните, что вам также необходимо, чтобы миграции были записаны в базе данных. Поэтому содержимое папки **src/typeorm/migrations** и таблицу **migrations_typeorm** тоже можно синхронизировать.

Кстати, название таблицы можно задать в файле **src/config/db.config.ts**, в параметре **migrationsTableName**.

[^ к оглавлению](#оглавление)
