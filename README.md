# nestapi
API backend service with REST and GrapQL based on Nest.js, TypeORM, Apollo

Этот бэк предоставляет уже готовые базовые возможности:

- управление регистрацией и авторизацией пользователей,
- получение и обработка файлов, в т.ч. изображений,
- работа с базой данных,
- RestAPI и GraphQl в любом сочетании по выбору.

Для примера бэк уже содержит несколько базовых сущностей. Обычно они нужны в любой системе в том или ином виде, так что вы можете использовать их не только в качестве примера, но и для работы.

# Пользователи

Обычно в системах данные пользователей и данные авторизации/аутентификации хранятся в одной таблице. В данном случае это две совершенно разные сущности.

Данные авторизации/аутентификации хранятся в таблице **auth**. Для работы с этими данными есть свои декораторы, DTO-шки, интерфейсы, стратегии, сервисы и пр., а также свой модуль с контроллером.

Такое разделение позволяет изолировать данные авторизации от прочих данных пользователя, а также все методы работы с ними.

Например, вы можете разрешить авторизацию по телефону и email. Вам не нужно заморачиваться с безопасностью и возможностью разделения этих данных для авторизации и для хранения в качестве контактной информации пользователя.

Также вы можете работать над авторизацией изолированно от прочих данных пользователя. Это относится, например, к реализации прав, авторизации по OAuth или OpenID и т.д.

У нас реализована авторизация с двумя jwt токенами, авторизация через google и механизм сессий.

Для контроллера у нас есть декоратор **@Auth**, который разрешает доступ только авторизованному пользователю. В этом декораторе можно указывать группу прав. Например:

    @Auth('admin')

Для пользователей у нас есть декоратор **@Self**. Например:

    ...(@Self() id: number) {...}

Его использование позволяет управлять данными именно того пользователя, от которого идет запрос.

Пользователи **users** и данные авторизации **auth** связаны между собой отношением один-к-одному по полю **id** (**auth.id**).

Предполагается, что пользователь не может просто так получить свои данные авторизации, но система позволяет их поменять. Примером такой реализации служит пароль.

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

# Отношения

Посты по-умолчанию являются базовой единицей. Каждый пост привязан к какому-либо автору, поэтому посты связаны с пользователями отношением многие-к-одному.

Также посты могут относится к какой-либо категории, предполагается, что только к одной. Поэтому посты связаны с категориями тоже отношением многие-к-одному.

А вот тегов посты могут иметь несколько. И посты связаны с тегами отношением многие-ко-многим.

Для такой связи предусмотрено создание отдельной таблицы **posts_by_tags**.

Любые подобные отношения предполагают взаимное изменение и удаление. Например, пост может поменять категорию, а при удалении категорий, удалятся все посты, которые входят в нее.

Все отношения прописаны в файлах **entity**.

Вы можете поменять существующие отношения или добавить новые.

# Модели данных

Модель данных в TypeOrm автоматически формирует базу данных с необходимыми полями и связями. Также на ее основе автоматически генерируется схема GraphQl. Такие модели представлены файлами с расширением **.entity.ts**.

Также мы использем DTO - классы описания данных, которые используются для типизации передаваемых данных к сервисам. Такие модели данных представлены файлами с расширением **.dto.ts**.

Все модели данных наследуют базовый класс, который содержит поля:

- id
- createdAt
- updatedAt

Для TypeOrm это:

    src/typeorm/entity/common.entity.ts

Для DTO это:

    src/typeorm/entity/common.dto.ts

# Контроллеры и резолверы

Контроллеры используются для запуска методов RestAPI. Контроллеры представлены файлами с расширением **.controller.ts**.

Для GraphQl вместо контроллеров используются резолверы. Они представлены файлами с расширением **.resolver.ts**.

Контроллеры и резолверы мы рекомендуем использовать в качестве обертки, а сам функционал реализовывать в сервисах.

## Аргументы

Мы сделали так, что контроллеры и резолверы используются максимально похоже.

Резолверы принимают аргументы через переменные GraphQl запроса, а контроллеры - через тело запроса. В обоих случаях аргументы имеют формат **JSON**.

Например, для условного запроса **getOne**, требуется аргумент **id**. Для контроллера и резолвера он будет передан одинаково:

    {
        "id": 1
    }

# Сервисы

Сервисы представляют собой классы, которые реализуют код сервисных функций. Они представлены файлами с расширением **.service.ts**.

Сервисы реализуют методы, которые перечислены в соответствующем разделе.

Однако, могут возникнуть ситуации, когда некоторые методы окажутся для вас избыточными. В таком случае, вы можете просто удалить их из контроллера и резолвера.

## Связи в сервисах

По-умолчанию связи в сервисах задаются константой, которая одинаково работает для всех методов внутри этого сервиса.

Например:

    const relations = ['category', 'tags'];

Такие связи для постов позволяют получить категорию поста и все его теги в виде вложенного объекта и массива объектов соответственно.

Вы можете даже использовать многоуровневые связи типа **post.category...**, но только если вложенные сущности не дублируют исходную сущность.

Многоуровневые связи типа **post.category.posts** создавать нельзя из-за возникновения перекрестного объединения сущностей.

## Создание сервисов

Если вы хотите создать собственные кастомные сервисы, предлагаем сделать это в отдельном файле, например **.custom.service.ts**.

Если сервисов много, вы можете положить их в отдельную папку. Например:

    posts
        services
            posts.first.service.ts
            posts.second.service.ts

> Не забудьте в этом случае следить за импортами сервисов!

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

# Методы

Мы предлагаем реализацию базовых методов для каждой сущности, что покрывает 90% всех потребностей.

Эти методы:

- get all - получить все записи
- get one - получить одну запись по id
- get many - получить несколько записей по списку id
- find - найти записи, поля которых соответствуют заданным условиям
- find in - поиск по записям, которые имеют заданные совпадения в заданных полях
- find last by - найти одну, последнюю запись, поля которой соответствуют заданным условиям
- group - найти записи и сгруппировать их по заданному полю
- create - создать новую запись
- update - обновить запись
- remove - удалить запись

Важно учитывать, что в сервисах и резолверах эти методы имеют впереди название сущности и пишутся в стиле camelCase. Например:

    postsGetAll

В контроллерах эти методы записываются в стиле snake_case. Название сущности задается в имени контроллера. Например:

    get_all
    /posts/get_all

# Сервисы

# Работа с файлами

- users

auth
files

limit   page    skip    result
10      1       5       6 - 15


