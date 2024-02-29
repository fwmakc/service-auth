RFC 6749
OAuth 2.0
October 2012

# Роли

## Resource owner

Владелец ресурса.

Объект, способный предоставить доступ к защищенному ресурсу. Если владельцем ресурса является человек, его называют end-user (конечный пользователь).

Например, вы.

## Resource server 

Сервер ресурсов.

Сервер, на котором размещены защищаемые ресурсы. Принимает и реагирует на запросы защищенных ресурсов с использованием access tokens (токенов доступа).

Например, сервис, которым хочет воспользоваться стороннее приложение от вашего имени.

## Client

Клиент.

Приложение, выполняющее запросы защищенных ресурсов от имени resource owner (владельца ресурса) и с его разрешения. Термин «клиент» не подразумевают каких-либо конкретных характеристик реализации (например, выполняется ли приложение на сервере, настольном компьютере или другом устройства).

Например, стороннее приложение.

## Authorization server

Сервер авторизации.

Сервер выдает access tokens (токены доступа) client (клиенту) после успешной аутентификации владельца ресурса и получения авторизации.

Взаимодействие сервера авторизации и сервера ресурсов выходит за рамки данной спецификации. Сервер авторизации может быть тем же сервером, что и сервер ресурсов, или отдельным объектом. Один сервер авторизации может выдавать токены доступа, принимаемые несколькими серверами ресурсов.

Например, приложение, в котором у вас уже есть учетная запись.

# Потоки

## Общая схема протокола

    +--------+                                +---------------+
    | Client |------------------------------->| Resource      |
    |        |  (A) Authorization Request     | Owner         |
    |        |      Запрос авторизации        |               |
    |        |                                |               |
    |        |<-------------------------------|               |
    |        |  (B) Authorization Grant       | Владелец      |
    |        |      Разрешение на авторизацию | Ресурса       |
    |        |                                +---------------+
    |        |
    |        |                                +---------------+
    |        |------------------------------->| Authorization |
    |        |  (C) Authorization Grant       | Server        |
    |        |      Разрешение на авторизацию |               |
    |        |                                |               |
    |        |<-------------------------------|               |
    |        |  (D) Access Token              | Сервер        |
    |        |      Токен доступа             | Авторизации   |
    |        |                                +---------------+
    |        |
    |        |                                +---------------+
    |        |------------------------------->| Resource      |
    |        |  (E) Access Token              | Server        |
    |        |      Токен доступа             |               |
    |        |                                |               |
    |        |<-------------------------------|               |
    |        |  (F) Protected Resource        | Сервер        |
    | Клиент |      Защищенный ресурс         | Ресурсов      |
    +--------+                                +---------------+

Общая схема потоков OAuth 2.0 описывает взаимодействие между четырьмя ролями и включает следующие этапы:

(A) Клиент запрашивает авторизацию у владельца ресурса.

Запрос на авторизацию можно сделать непосредственно владельцу ресурса (как показано), или желательно косвенно через сервер авторизации в качестве посредника.

(B) Клиент получает грант (разрешение на авторизацию), которое является credential (учетными данными). Они дают авторизацию от имени владельца ресурса. Для этого используется один из четырех типов Authorization grant (разрешений на авторизацию), определенных в этом документе или расширенный тип.

Тип Authorization grant (разрешения на авторизацию) зависит от метода, который использует клиент для запроса авторизации и от типов, поддерживаемых самим сервером авторизации.

(C) Клиент запрашивает токен доступа, аутентифицируясь с помощью сервера авторизации и предоставления гранта (разрешения на авторизацию).

(D) Сервер авторизации аутентифицирует клиента и проверяет грант (разрешение на авторизацию) и, если оно действительно, выдает токен доступа.

(E) Клиент запрашивает защищенный ресурс у сервера ресурсов и аутентифицируется, предоставляя токен доступа.

(F) Сервер ресурсов проверяет токен доступа, и, если он действителен, выполняет запрос.

## Получение кода авторизации

Предпочтительный метод получения клиентом гранта (разрешения на авторизацию) от владельца ресурса (описанного на шагах A и B) — использовать сервер авторизации в качестве посредника.

    +--------+       +-------+                                +---------------+
    | Client |------>| User- |------------------------------->| Authorization |
    |        |  (A)  | Agent |  (A) Client Identifier         | Server        |
    |        |       |       |      & Redirection URI         |               |
    |        |       |       |                                |               |
    |        |       |       |------------------------------->|               |
    |        |       |       |  (B) User authenticates        |               |
    |        |       |       |      Разрешение на авторизацию |               |
    |        |       |       |                                |               |
    |        |       |       |                                |               |
    |        |<------|       |<------------------------------>|               |
    |        |  (C)  |       |  (C) Authorization Code        |               |
    |        |       |       |      Разрешение на авторизацию |               |
    |        |       +-------+                                |               |
    |        |                                                |               |
    |        |----------------------------------------------->|               |
    |        |                   (D) Authorization Code       |               |
    |        |                       & Redirection URI        |               |
    |        |                                                |               |
    |        |<-----------------------------------------------|               |
    |        |                   (E) Access Token             | Сервер        |
    | Клиент |                       Optional Refresh Token   | Авторизации   |
    +--------+                                                +---------------+
                                                                      |
                                                                      | (B)
                                                                      V
                                                              +---------------+
                                                              | Resource      |
                                                              | Owner         |
                                                              |               |
                                                              | Владелец      |
                                                              | Ресурсов      |
                                                              +---------------+

(A) Клиент инициирует поток, направляя пользовательский агент владельца ресурса в конечную точку авторизации. Клиент включает:

    - идентификатор клиента,
    - область доступа,
    - локальное состояние,
    - URI перенаправления.

(B) Сервер авторизации аутентифицирует владельца ресурса (через пользовательский агент) и определяет, разрешает или отклоняет владелец ресурса запрос доступа клиента.

(C) Предполагая, что владелец ресурса предоставляет доступ, сервер авторизации перенаправляет пользовательский агент обратно клиенту, используя URI перенаправления, предоставленный ранее (в запросе или во время регистрации клиента). URI перенаправления включает код авторизации и любое локальное состояние, предоставленное клиентом ранее.

(D) Клиент запрашивает токен доступа у конечной точки токена сервера авторизации, включая код авторизации, полученный на предыдущем шаге. При выполнении запроса клиент проходит аутентификацию на сервере авторизации. Клиент включает URI перенаправления, используемый для получения кода авторизации для проверки.

(E) Сервер авторизации аутентифицирует клиента, проверяет код авторизации и гарантирует, что полученный URI перенаправления соответствует URI, используемому для перенаправления клиента на этапе (C). Если оно действительно, сервер авторизации отправляет в ответ токен доступа и, при необходимости, токен обновления.

## Получение токенов доступа

Тип Implicit Grant (Неявный грант) используется для получения токенов доступа. Он не поддерживает выпуск токенов обновления и оптимизирован для публичных клиентов с использованием URI перенаправления.


    +--------+       +-------+                                +---------------+
    | Client |------>| User- |------------------------------->| Authorization |
    |        |  (A)  | Agent |  (A) Client Identifier         | Server        |
    |        |       |       |      & Redirection URI         |               |
    |        |       |       |                                |               |
    |        |       |       |------------------------------->|               |
    |        |       |       |  (B) User authenticates        |               |
    |        |       |       |                                |               |
    |        |       |       |<-------------------------------|               |
    |        |       |       |  (C) Redirection URI with      | Сервер        |
    |        |       |       |      Access Token in Fragment  | Авторизации   |
    |        |       |       |                                +---------------+
    |        |       |       |
    |        |       |       |                                +---------------+
    |        |       |       |------------------------------->| Web-Hosted    |
    |        |       |       |  (D) Redirection URI           | Client        |
    |        |       |       |      without Fragment          | Resource      |
    |        |       |       |                                |               |
    |        |<------| -(F)- |<-------------------------------|               |
    |        |  (G)  |       |  (E) Script                    |               |
    | Клиент |       |       |                                | Веб-ресурс    |
    +--------+       +-------+                                +---------------+
                         |
                         | (B)
                         V
                   +-----------+
                   | Resource  |
                   | Owner     |
                   |           |
                   | Владелец  |
                   | Ресурсов  |
                   +-----------+

(A) идентичен предыдущему.

(B) идентичен предыдущему.

(C) идентичен предыдущему, только URI перенаправления включает токен доступа во фрагменте URI.

(D) Пользовательский агент следует инструкциям по перенаправлению, отправляя запрос к ресурсу веб-клиента (который не включает фрагмент согласно [RFC2616]). Пользовательский агент сохраняет информацию о фрагменте локально.

(E) Ресурс веб-клиента возвращает веб-страницу (обычно HTML-документ со встроенным скриптом), способную получить доступ к полному URI перенаправления, включая фрагмент, сохраняемый пользовательским агентом, и извлечь токен доступа и другие параметры, которые содержатся во фрагментах.

(F) Пользовательский агент локально выполняет сценарий, предоставленный веб-клиентским ресурсом, который извлекает токен доступа.

(G) Пользовательский агент передает токен доступа клиенту.

# Типы грантов (разрешений на авторизацию)

## Authorization Code (Код авторизации)

Код авторизации выдается сервером авторизации, который выступает в качестве посредника между клиентом и владельцем ресурса. Вместо того, чтобы запрашивать авторизацию непосредственно у владельца ресурса, клиент направляет владельца ресурса на сервер авторизации (через его пользовательский агент, как определено в [RFC2616]), который, в свою очередь, направляет владельца ресурса обратно клиенту, но уже с кодом авторизации.

Прежде чем направить владельца ресурса обратно клиенту с кодом авторизации, сервер авторизации аутентифицирует владельца ресурса и получает авторизацию. Поскольку владелец ресурса проходит проверку подлинности только на сервере авторизации, учетные данные владельца ресурса никогда не передаются клиенту.

Код авторизации обеспечивает несколько важных преимуществ безопасности, таких как возможность аутентификации клиента, а также передача токена доступа непосредственно клиенту без передачи его через пользовательский агент владельца ресурса и потенциального раскрытия его другим, в том числе владельцу ресурса.

## Implicit Grant (Неявное разрешение)

Неявное разрешение — это упрощенный механизм кода авторизации. Сделан для веб-приложений на JavaScript. В этом механизме вместо выдачи кода авторизации, клиенту напрямую выдается токен доступа (в результате авторизации владельца ресурса). Тип назван неявным, поскольку промежуточные учетные данные (например, код авторизации) не выдаются (и позже используются для получения токена доступа).

При выдаче токена доступа во время получения гранта (разрешения на авторизацию) сервер авторизации не аутентифицирует клиента. В некоторых случаях личность клиента можно проверить с помощью URI перенаправления, используемого для доставки токена доступа клиенту. Токен доступа может быть разрешен владельцу ресурса или другим приложениям, имеющим доступ к пользовательскому агенту владельца ресурса.

Неявное разрешение улучшает скорость и эффективность некоторых клиентов (например, веб-приложения), поскольку уменьшают количество циклов передачи данных, необходимых для получения токена доступа. Однако это удобство следует сопоставить с последствиями для безопасности использования неявных разрешений, таких как описанные ниже, особенно когда доступен тип разрешения Код авторизации.

## Resource Owner Password Credentials (Учетные данные пароля владельца ресурса)

Учетные данные пароля владельца ресурса (т. е. имя пользователя и пароль) могут использоваться непосредственно в качестве гранта (разрешения на авторизацию) для получения токена доступа. Учетные данные следует использовать только в том случае, если между владельцем ресурса и клиентом существует высокая степень доверия (например, клиент является частью операционной системы устройства или приложения с высокими привилегиями), а также когда другие типы грантов (разрешений авторизации) недоступны (например, код авторизации).

Несмотря на то, что этот тип требует прямого доступа клиента к учетным данным владельца ресурса, учетные данные владельца ресурса используются для одного запроса и заменяются маркером доступа. Этот тип гранта (разрешения) может устранить необходимость хранения клиентом учетных данных владельца ресурса для будущего использования путем обмена учетными данными на долгосрочный токен доступа или токен обновления.

## Client Credentials (Учетные данные клиента)

Учетные данные клиента (или другие формы аутентификации клиента) могут использоваться в качестве гранта (разрешения на авторизацию), когда область доступа ограничена защищенными ресурсами, находящимися под контролем клиента, или защищенными ресурсами, предварительно согласованными с сервером авторизации. Учетные данные клиента используются в качестве гранта (разрешения на авторизацию), как правило, когда клиент действует от своего имени (клиент также является владельцем ресурса) или запрашивает доступ к защищенным ресурсам на основе авторизации, предварительно согласованной с сервером авторизации.

## Неправильное использование токена доступа для выдачи себя за владельца ресурса

При использовании Неявного разрешения, эта спецификация не дает никакого метода проверки того, какому клиенту был выдан токен доступа.

Владелец ресурса может добровольно делегировать доступ к ресурсу, предоставив токен доступа злоумышленнику. Злоумышленник также может украсть токен с помощью другого механизма. Затем злоумышленник может попытаться выдать себя за владельца ресурса, предоставив токен доступа клиенту.

В неявном потоке (response_type=token) злоумышленник может легко подменить токен в ответе от сервера авторизации, заменив реальный токен доступа на ранее выданный злоумышленнику.

Серверы, взаимодействующие с собственными приложениями, которые полагаются на передачу токена доступа по обратному каналу для идентификации пользователя клиента, могут быть аналогичным образом скомпрометированы злоумышленником, создающим взломанное приложение, которое может внедрить произвольные украденные токены доступа.

Любой общедоступный клиент, который предполагает, что только владелец ресурса может предоставить ему действительный токен доступа к ресурсу, уязвим для этого типа атаки.

Этот тип атаки может раскрыть злоумышленнику информацию о владельце ресурса легитимного клиента. Это также позволит злоумышленнику выполнять операции на законном клиенте с теми же правами, что и у владельца ресурса, который первоначально предоставил токен доступа или код авторизации.

Аутентификация владельцев ресурсов для клиентов выходит за рамки данной спецификации. Любая спецификация, которая использует процесс авторизации как форму делегированной аутентификации конечного пользователя клиенту (например, сторонняя служба входа), НЕ ДОЛЖНА использовать неявный поток без дополнительных механизмов безопасности, которые позволили бы клиенту определить, был ли выдан токен для его использования (например, токен доступа с ограничением аудитории).

# Регистрация клиента

Перед запуском протокола клиент регистрируется на сервере авторизации. Способы регистрации клиента на сервере авторизации выходят за рамки этой спецификации.

При регистрации клиента разработчик клиента ОБЯЗАН указать:

    - тип клиента,
    - URI перенаправления клиента,
    - любую другую информацию, требуемую сервером авторизации
    (например, название приложения, веб-сайт, описание, изображение логотипа, принятие юридических условий).

## Типы клиентов

### Confidential (Конфиденциальный)

Клиенты, способные сохранить конфиденциальность своих учетных данных или безопасную аутентификацию клиента с использованием других средств.

Например, веб-приложение, реализованное на защищенном сервере с ограниченным доступом к учетным данным.

### Public (Публичный)

Клиенты, неспособные сохранить конфиденциальность своих учетных данных и не поддерживающие безопасную аутентификацию любым другим способом.

Например, нативное или браузерное приложение, выполняющееся на устройстве, используемом владелец ресурса.

## Идентификатор клиента

Сервер авторизации выдает зарегистрированному клиенту идентификатор — уникальную строку. Идентификатор клиента не является секретным ключом, он доступен владельцу ресурса и НЕ ДОЛЖЕН в одиночку использоваться для аутентификации клиента.

## Аутентификация клиента

Если тип клиента конфиденциальный, клиент и сервер авторизации устанавливают метод аутентификации клиента, подходящий для требований безопасности сервера авторизации.

Конфиденциальным клиентам обычно выдается набор:

   - пароль,
   - пара открытого/закрытого ключей.

Клиенты, обладающие клиентским паролем, МОГУТ использовать схему аутентификации HTTP Basic, определенную в [RFC2617], для аутентификации с помощью сервера авторизации.

Идентификатор клиента кодируется с использованием алгоритма кодирования "application/x-www-form-urlencoded". Закодированное значение используется в качестве имени пользователя. Пароль клиента кодируется с использованием того же алгоритма и используется как пароль.

Например:

    Authorization: Basic czZCaGRSa3F0Mzo3RmpmcDBaQnIxS3REUmJuZlZkbUl3

Сервер авторизации МОЖЕТ поддерживать учетные данные клиента в теле запроса:

    - client_id
    ОБЯЗАТЕЛЬНО. Идентификатор клиента, выданный во время регистрации.

    - client_secret
    ОБЯЗАТЕЛЬНО. Секретный ключ. Клиент МОЖЕТ опустить этот параметр, если секретный ключ представляет собой пустую строку.

Например, запрос на обновление токена доступа:

    POST /token HTTP/1.1
    Host: server.example.com
    Content-Type: application/x-www-form-urlencoded

    grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
    &client_id=s6BhdRkqt3&client_secret=7Fjfp0ZBr1KtDRbnfVdmIw

Сервер авторизации ДОЛЖЕН требовать использования TLS при отправке запросов с использованием аутентификации по паролю.

Сервер авторизации МОЖЕТ поддерживать любую подходящую схему HTTP-аутентификации, соответствующую требованиям безопасности. Сервер авторизации ДОЛЖЕН сопоставить идентификатор клиента (регистрационную записью) и схему аутентификации.

Клиент НЕ ДОЛЖЕН использовать более одного метода аутентификации в каждом запросе. Сочетание методов НЕ РЕКОМЕНДУЕТСЯ и ДОЛЖНО быть ограничено для клиентов, которые не могут напрямую использовать схему аутентификации HTTP Basic. Параметры могут передаваться только в теле запроса и НЕ ДОЛЖНЫ включаться в запрос URI.

# Endpoints (Конечные точки) протокола

    - Authorization (авторизация) - используется клиентом для получения авторизация от владельца ресурса через перенаправление пользовательского агента.

    - Token (токен) - используется клиентом для обмена авторизации на токен доступа, обычно с аутентификацией клиента.

    - Redirection (перенаправление) - используется сервером авторизации для возврата клиенту ответов, содержащих учетные данные авторизации, через пользовательский агент владельца ресурса.

Не каждый тип гранта использует все конечные точки. Расширенные типы грантов МОГУТ определять дополнительные конечные точки по мере необходимости.

URI конечной точки МОЖЕТ включать в себя «application/x-www-form-urlencoded» запроса.

## Конечная точка авторизации и перенаправления

Сервер авторизации ДОЛЖЕН поддерживать использование HTTP «GET» метода [RFC2616] для конечной точки авторизации и МОЖЕТ поддерживать использование метода «POST».

Конечная точка авторизации используется при предоставлении кода авторизации. Клиент сообщает серверу авторизации о желаемом типе гранта, используя следующий параметр:

    - response_type
    ОБЯЗАТЕЛЬНО. Значение ДОЛЖНО быть одним из установленных типов.

Установленные типы:

    - «code» для запроса код авторизации,
    - «token» для запрос токена доступа (неявный грант),
    - другое зарегистрированное значение расширения.

URI конечной точки перенаправления ДОЛЖЕН быть абсолютным URI, как определено [RFC3986].

Конечная точка перенаправления ДОЛЖНА требовать использования TLS.

Если TLS недоступен, серверу авторизации СЛЕДУЕТ предупредить владельца ресурса о небезопасной конечной точке до перенаправления (например, отобразить сообщение при запросе авторизации).

Клиент НЕ ДОЛЖЕН включать в себя какие-либо сторонние скрипты (например, сторонние скрипты).

Если зарегистрировано несколько URI перенаправлений, клиент ДОЛЖЕН включать URI перенаправления с запроса авторизации с использованием параметра запроса

    redirect_uri

Если в запрос авторизации включен URI перенаправления, сервер авторизации ДОЛЖЕН сравнивать полученное значение по крайней мере одному из зарегистрированных URI перенаправления.

Если запрос на авторизацию не проходит проверку из-за отсутствия или наличия недействующего URI перенаправления, серверу авторизации СЛЕДУЕТ сообщить владельцу ресурса об ошибке и НЕ ДОЛЖНО автоматически перенаправлять пользовательский агент на недопустимый URI перенаправления.

## Конечная точка токена

Конечная точка токена используется клиентом для получения или обновления токена доступа.

Используется при каждом предоставлении авторизации, за исключением неявного типа гранта (поскольку токен доступа выдается напрямую).

Поскольку запросы к конечной точке токена приводят к передаче учетных данных в открытом виде (в HTTP-запросе и ответе), сервер авторизации ДОЛЖЕН требовать использования TLS.

Клиент ДОЛЖЕН использовать метод HTTP «POST» при создании токена доступа.

Сервер авторизации ДОЛЖЕН игнорировать нераспознанные параметры запроса.

При отправке запросов к конечной точке токена с типом гранта

    grant_type = "authorization_code"

чтобы идентифицировать себя, неаутентифицированный клиент ДОЛЖЕН (аутентифицированный клиент МОЖЕТ) отправить параметр запроса

    client_id
    
Это защищает клиента от случайной или намеренной подмены кода аутентификации. Но это не обеспечивает никакой дополнительной безопасности для защиты ресурса.

## Область доступа

Конечные точки авторизации и токена позволяют клиенту запросить область доступа с помощью параметра запроса

    scope

В свою очередь, сервер авторизации использует параметр ответа scope, чтобы сообщить клиенту о разрешенной области доступа.

Значение параметра выражается в виде списка значений, разделенных пробелами и чувствительных к регистру. Их порядок не имеет значения, и каждая строка добавляет дополнительную область доступа.

    scope       = scope-token *( SP scope-token )
    scope-token = 1*( %x21 / %x23-5B / %x5D-7E )

Сервер авторизации МОЖЕТ полностью или частично игнорировать область действия, запрошенную клиентом, на основании политики сервера авторизации или инструкции владельца ресурса. Если область действия выданного токена доступа отличается от запрошенной клиентом, сервер авторизации ДОЛЖЕН включать параметр ответа «scope», чтобы сообщить клиенту о фактически предоставленной области доступа.

Если клиент пропускает параметр области при запросе авторизации, сервер авторизации ДОЛЖЕН либо обработать
запрос, используя заранее определенное значение по умолчанию, или отклонить запроса, указывая недопустимую область действия. Сервер авторизации ДОЛЖЕН задокументировать свои требования к области действия и значение по умолчанию (если оно определено).

# Запросы

## Запрос авторизации

    - response_type
    ОБЯЗАТЕЛЬНО. Тип ответа.
    Для типа гранта Authorization Code значение ДОЛЖНО быть установлено на «code».
    Для типа гранта Implicit Grant (Неявное разрешение) значение ДОЛЖНО быть установлено на «token».

    - client_id
    ОБЯЗАТЕЛЬНО. Идентификатор клиента.

    - redirect_uri
    ОПЦИОНАЛЬНО. URI перенаправления.

    - scope
    ОПЦИОНАЛЬНО. Область доступа.

    - state
    РЕКОМЕНДУЕМЫЙ. Значение, используемое клиентом для поддержания состояния между запросом и обратным вызовом. Сервер авторизации включает это значение при перенаправлении пользовательского агента обратно клиенту. Параметр СЛЕДУЕТ использовать для предотвращения подделки межсайтового запроса.

Например:

    GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
        &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
    Host: server.example.com

Для Implicit Grant при успешной авторизации возвращается сразу ответ на токен доступа.

Ответ авторизации:

    - code
    ОБЯЗАТЕЛЬНО. Код авторизации, сгенерированный сервером авторизации. Код авторизации ДОЛЖЕН истечь вскоре после его выпуска, чтобы снизить риск утечек. РЕКОМЕНДУЕМОЕ максимальное время жизни кода авторизации составляет 10 минут. Клиент НЕ ДОЛЖЕН использовать один код авторизации больше одного раза. Если код авторизации используется повтороно, сервер авторизации ДОЛЖЕН отклонить запрос и ДОЛЖЕН отозвать (когда это возможно) все ранее выпущенные токены на основании этого кода авторизации. Код авторизации привязан к идентификатору клиента и URI перенаправления.

    - state
    ОБЯЗАТЕЛЬНО только если в запросе авторизации от клиента присутствовал параметр «state». Точное значение, полученное от клиента.

Например:

    HTTP/1.1 302 Found
    Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz

## Запрос токена доступа

    - grant_type
    ОБЯЗАТЕЛЬНО. Значение ДОЛЖНО быть установлено как «authorization_code».

    - code
    ОБЯЗАТЕЛЬНО. Код авторизации, полученный от сервера авторизации.

    - redirect_uri
    URI перенаправления. ОБЯЗАТЕЛЬНО, если параметр «redirect_uri» был включен в запрос авторизации. Их значения ДОЛЖНЫ быть идентичными.

    - client_id
    ОБЯЗАТЕЛЬНО, если клиент не проходит аутентификацию с помощью сервера авторизации.

Например:

    POST /token HTTP/1.1
    Host: server.example.com
    Authorization: Basic  czZCaGRSa3F0MzpnWDFmQmF0M2JW.
    Content-Type: application/x-www-form-urlencoded

    grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
    &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb

## Запрос токена доступа с паролем

    - grant_type
    ОБЯЗАТЕЛЬНО. Значение ДОЛЖНО быть установлено как «password».

    - username
    ОБЯЗАТЕЛЬНО. Имя пользователя владельца ресурса.

    - password
    ОБЯЗАТЕЛЬНО. Пароль владельца ресурса.

    - scope
    ОПЦИОНАЛЬНО. Область доступа.

Например:

    POST /token HTTP/1.1
    Host: server.example.com
    Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
    Content-Type: application/x-www-form-urlencoded

    grant_type=password&username=johndoe&password=A3ddj3w

## Обновление токена доступа

    - grant_type
    ОБЯЗАТЕЛЬНО. Значение ДОЛЖНО быть установлено как «authorization_code».

    - refresh_token
    ОБЯЗАТЕЛЬНО. Токен обновления, выданный клиенту.

    - scope
    ОПЦИОНАЛЬНО. Область доступа.

Например:

    POST /token HTTP/1.1
    Host: server.example.com
    Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
    Content-Type: application/x-www-form-urlencoded

    grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA

## Ответ на токен доступа

    - access_token
    ОБЯЗАТЕЛЬНО. Токен доступа, выданный сервером авторизации.

    - token_type
    ОБЯЗАТЕЛЬНО. Тип токена, выпущенного, как описано в Раздел 7.1 . Значение не чувствительно к регистру.

    - expires_in
    РЕКОМЕНДУЕМЫЙ. Время жизни токена доступа в секундах. Если этот параметр опущен, сервер авторизации ДОЛЖЕН предоставить срок действия другими способами или задокументируйте значение по умолчанию.

    - refresh_token
    ОПЦИОНАЛЬНО. Токен обновления, который можно использовать для получения новых токенов доступа с использованием того же разрешения авторизации.

    - scope
    ОПЦИОНАЛЬНО. Область доступа.

    - state
    ОБЯЗАТЕЛЬНО, если в запрос авторизации от клиента присутствовал параметр «state». Точное значение, полученное от клиента.

Сервер авторизации НЕ ДОЛЖЕН выдавать токен обновления.

Например:

    HTTP/1.1 302 Found
    Location: http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA
              &state=xyz&token_type=example&expires_in=3600

Пример успешного ответа на токен доступа:

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=UTF-8
    Cache-Control: no-store
    Pragma: no-cache

    {
        "access_token":"2YotnFZFEjr1zCsicMWpAA",
        "token_type":"example",
        "expires_in":3600,
        "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
        "example_parameter":"example_value"
    }

# Ошибки

Если запрос не выполнен из-за отсутствия, недействительности или несоответствия URI перенаправления или если идентификатор клиента отсутствует или недействителен, сервер авторизации ДОЛЖЕН сообщить владельцу ресурса об ошибке и НЕ ДОЛЖЕН автоматически перенаправлять пользовательский агент на неверный URI перенаправления.

Если владелец ресурса отклоняет запрос на доступ или если запрос завершается сбоем по причинам, отличным от отсутствующего или недопустимого URI перенаправления, сервер авторизации информирует клиента, добавляя следующие параметры в компонент запроса URI перенаправления, используя формат «application/x-www-form-urlencoded»:

    - error
    ОБЯЗАТЕЛЬНО. Код ошибки ASCII. Значения параметра error НЕ ДОЛЖНЫ включать символы вне набора %x20-21 / %x23-5B / %x5D-7E.

    - error_description
    ОПЦИОНАЛЬНО. Удобочитаемый текст ASCII, дополнительная информация, используемая для помощи разработчику клиента в понимание возникшей ошибки. Значения параметра error_description НЕ ДОЛЖНЫ включать символы вне набора %x20-21 / %x23-5B / %x5D-7E.

    - error_uri
    ОПЦИОНАЛЬНО. URI, идентифицирующий удобочитаемую веб-страницу с информацией об ошибке, используется для предоставления разработчику клиента дополнительной информации об ошибке. Значения параметра error_uri ДОЛЖНЫ соответствовать синтаксису ссылки URI и, следовательно, НЕ ДОЛЖНЫ включать символы вне набора %x21 / %x23-5B / %x5D-7E.

    - state
    ОБЯЗАТЕЛЬНО, если в запрос авторизации от клиента присутствовал параметр «state». Точное значение, полученное от клиента.
    
Например:

    HTTP/1.1 302 Found
    Location: https://client.example.com/cb?error=access_denied&state=xyz.

Или:

    HTTP/1.1 400 Bad Request
    Content-Type: application/json;charset=UTF-8
    Cache-Control: no-store
    Pragma: no-cache

    {
        "error":"invalid_request"
    }

Коды ошибок ASCII:

    - invalid_request
    Неверный запрос. В запросе отсутствует обязательный параметр, имеется недопустимое значение параметра, присутствует несколько одинаковых параметров или запрос иным образом скомпрометирован.

    - invalid_client
    Аутентификация клиента не удалась (например, неизвестный клиент, аутентификация клиента не включена или метод аутентификации не поддерживается). Сервер авторизации МОЖЕТ вернуть код состояния HTTP 401 (Unauthorized), чтобы указать какие схемы аутентификации HTTP поддерживаются. Если клиент попытался пройти аутентификацию через заголовок «Authorization», сервер авторизации ДОЛЖЕН ответить кодом состояния HTTP 401 (Unauthorized) и включить поле заголовка «WWW-Authenticate» в ответ в соответствии со схемой аутентификации, используемой клиентом.

    - invalid_grant
    Предоставленное разрешение на авторизацию (например, авторизация код, учетные данные владельца ресурса) или токен обновления недействителен, срок действия истек, отозван, использованное в запросе авторизации перенаправление URI не соответствует или разрешение было выдано другому клиенту.

    - unauthorized_client
    Клиент не имеет прав, чтобы запрашивать код авторизации, используя этот метод.

    - unsupported_grant_type
    Тип гранта не поддерживается сервером авторизации.

    - access_denied
    Доступ запрещен. Владелец ресурса или сервер авторизации отклонили запрос.

    - unsupported_response_type
    Сервер авторизации не поддерживает получение кода авторизации с помощью этого метода.

    - invalid_scope
    Недопустимая область. Запрошенная область доступа недействительна, неизвестна или имеет неверный формат.

    - server_error
    Ошибка сервера. Сервер авторизации обнаружил неожиданную ошибку, которая помешала ему выполнить запрос. (Этот код ошибки необходим, поскольку внутренний сервер 500 Код состояния HTTP ошибки не может быть возвращен клиенту через перенаправление HTTP).

    - temporarily_unavailable
    Временно недоступен. Сервер авторизации в настоящее время не может обработать запрос из-за временной перегрузки или технического обслуживания сервера. (Этот код ошибки необходим, поскольку ошибка 503
    Служба недоступна Код состояния HTTP не может быть возвращен клиенту через перенаправление HTTP).

# Параметры OAuth

    VSCHAR = %x20-7E
    NQCHAR = %x21 / %x23-5B / %x5D-7E
    NQSCHAR = %x20-21 / %x23-5B / %x5D-7E
    UNICODECHARNOCRLF = %x09 / %x20-7E / %x80-D7FF / %xE000-FFFD / %x10000-10FFFF

    - client_id (authorization request, token request)
    client-id     = *VSCHAR

    - client_secret (token request)
    client-secret = *VSCHAR

    - response_type (authorization request)
    response-type = response-name *( SP response-name )
    response-name = 1*response-char
    response-char = "_" / DIGIT / ALPHA

    - redirect_uri (authorization request, token request)
    redirect-uri      = URI-reference

    - scope (authorization request, authorization response, token request, token response)
    scope       = scope-token *( SP scope-token )
    scope-token = 1*NQCHAR

    - state (authorization request, authorization response)
    state      = 1*VSCHAR

    - code (authorization response, token request)
    code       = 1*VSCHAR

    - error_description (authorization response, token response)
    error             = 1*NQSCHAR
    error-description = 1*NQSCHAR

    - error_uri (authorization response, token response)
    error-uri         = URI-reference

    - grant_type (token request)
    grant-type = grant-name / URI-reference
    grant-name = 1*name-char
    name-char  = "-" / "." / "_" / DIGIT / ALPHA

    - access_token (authorization response, token response)
    access-token = 1*VSCHAR

    - token_type (authorization response, token response)
    token-type = type-name / URI-reference
    type-name  = 1*name-char
    name-char  = "-" / "." / "_" / DIGIT / ALPHA

    - expires_in (authorization response, token response)
    expires-in = 1*DIGIT

    - username (token request)
    username = *UNICODECHARNOCRLF

    - password (token request)
    password = *UNICODECHARNOCRLF

    - refresh_token (token request, token response)
    refresh-token = 1*VSCHAR

# Типы ответов авторизации

    - code
    - token

    param-name = 1*name-char
    name-char  = "-" / "." / "_" / DIGIT / ALPHA