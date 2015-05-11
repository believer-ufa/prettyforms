PrettyForms
===========

Русская документация расположена [ниже в данном документе](https://github.com/believer-ufa/prettyforms/blob/master/README.md#prettyforms-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F).

A small library, through which you can easily make the form validation on the client and server sides. Originally set up to work with [Twitter Bootstrap](http://getbootstrap.com).

Depends: jQuery, [SweetAlert](https://github.com/t4t5/sweetalert) (this is optional).

[Screencast of the library](demo.gif)

## Installation
You can download a zip-file with the library, or set it through the bower:
```shell
bower install prettyforms --save
```

*Tip:* to further increase the usability of your site, you can also connect the [SweetAlert](https://github.com/t4t5/sweetalert) library, which will be automatically used by Prettyforms.

## The algorithm of the library:
1. The user fills the fields and clicks a submit button. Library validates all data and, if all goes well, it collects all the data and send the form POST request to server and expects a JSON-answer in a special format.
2. The server receives the request, conducting additional validation of the data is already on his side. If there are errors in the validation server, it returns to the client a specially crafted JSON-response containing the command to display the server validation error information about the fields and they contain mistakes.
3. If the data have been validated successfully, the server performs the necessary operations and returns JSON-response describing the action that the client machine must perform after a successful transaction processing.

That is, the server always meet a certain set of commands for the browser, and the browser simply executes these commands on a client machine. This is the algorithm of the library.

## Laravel 5

For Laravel, a special component that greatly expands its features and uses for client validation the current library. For more details you can read about it on the [page of this component](https://github.com/believer-ufa/prettyforms-laravel).

## Example of use

Connect the JS-file `prettyforms.js` to the page, and add an attribute validation `data-validation="rules;to;validation"` a list of validation rules to all fields of your form. After adding the rules, the form fields will automatically become a library for validation PrettyForms. If the data will be invalid, the library will not allow the form to go to the server. This is the minimum functional library without server binding.

In order to connect the library to work with the server, add to your standard submit button class `senddata`, by which clicks the button will be captured and processed by library. Now the library will not only produce customer validation, and will be responsible for sending data to the server and handle the response.

Example forms for Bootstrap-validation framework with attributes:

```html
<form class="form-horizontal" role="form" method="POST" action="/register">
    <h1 class="form-signin-heading">Registration</h1>
    <div class="form-group">
        <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
        <div class="col-sm-10">
            <input type="email"
                   class="form-control"
                   id="inputEmail3"
                   name="email"
                   data-validation="notempty;isemail"
                   placeholder="Enter your email">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
        <div class="col-sm-10">
            <input
                type="password"
                class="form-control"
                id="inputPassword3"
                name="password"
                data-validation="notempty;minlength:6"
                placeholder="Your password">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword4" class="col-sm-2 control-label">Confirm password</label>
        <div class="col-sm-10">
            <input type="password"
                   class="form-control"
                   id="inputPassword4"
                   name="password_retry"
                   data-validation="notempty;passretry"
                   placeholder="Confirm password suddenly make a mistake? We will check it.">
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <div class="btn btn-default senddata">Register</div>
        </div>
    </div>
</form>
```

## Field validators

Validation rules are separated by `;`, the parameters for the rule passed through a `:`.
An example of a correct list of rules contains two rules, one of them with a parameter: `"notempty;minlength:6"`

| Name | Description | Option |
| ------------- | ------------- | --------- |
| notempty | Field can not be empty. If a set of radio-input, then one of them must be marked. | No opts |
| minlength | Not less than {%} characters | Number of characters |
| maxlength | Not more than {%} characters | Number of characters |
| hasdomain | The address must start with the correct domain ({%}) | Domain |
| isnumeric | The field can only contain numbers | No opts |
| isemail | There should be a valid E-Mail | No opts |
| isdate | The field must contain the date | No opts |
| isphone | The field should contain a telephone number | No opts |
| minint | Minimum number entered {%} | number |
| maxint | Maximum number entered {%} | number |
| intonly | You can enter only the number of | Number |
| passretry | Must be equal to the password field | field name with password, the default "password" |
| checked | Check that checkbox-element is checked. Used to the need to agree to the terms of the license, for example. | No opts |

#### Adding a custom validator rule
You can easily add your own validators, using a similar example:
```javascript
$(window).load(function(){
  PrettyForms.Validator.setValidator('needempty', 'The field should be empty!', function(element, value, param){
      // needempty - validator name
      // the second option - error message
      // third - is validation function itself, which passed three parameters: jQuery-element, value of this element, and validator parameters if it was referred to the properties of the validation
      return value === '';
  });
});
```

#### Additional attributes of validation
The library also allows you to add to the fields some additional attributes that govern the behavior of the test field.

| Attribute | Description | Required?|
| ------------- | ------------- |-------------|
| data-dontsend="true"  | Disables verification of the field and sending it to the server | No |


## Attributes of submit button
Button, clicking on which generates a sending form can also have several additional attributes that explain where data should be sent from which DOM-element has to be collected, and some other forms of behavior characteristics. If the attributes have not been specified, the data will be taken from your form.

| Attribute | Description | Required? |
| ------------- | ---------|--------------|
| data-input  | jQuery-selector element from which data will be collected to send to the server | No, unless otherwise indicated, it will attempt to pull the data from the form, which contains the button. If the form has not been found, a request is sent with no data. |
| href or data-link  | The address to which to send the data  | No, the default data will be taken from the `action` attribute form, and if it's empty, they will be sent to the current URL of the page |
| data-clearinputs="true" | Clear form fields after a successful request?  | No require |
| class="... really"  | Lets ask before sending data. If the [SweetAlert](https://github.com/t4t5/sweetalert) is connected to the site, it will be used. | No require |
| data-really-text=""  | The question text, the default is taken from the `PrettyForms.messages.really` | No require |
| data-really-text-btn=""  | Text button, clicking on which will cause the action. By default, the text is taken from `PrettyForms.messages.really_agree` | No require |

## Validation on server
Validation on the server must do the framework with which you are working. Library expects a response object whose keys - the names of commands and values - a command parameters. So, the command for displaying validation errors called `validation_errors`, as well as its parameters must be specified is another object whose keys are the field names and values as they shall contain one-dimensional arrays with texts validation errors, which were not passed.

In other words, the logic would be similar to the following: if the field validation fails, the server returns a JSON-response command to display errors. If the validation is successful, the server returns a JSON-response with other commands, for example, redirect user to a page message on successful registration. An example of responding to PHP:
```php
// Validate the data, stores the result in the validation of $validation_success

if ($validation_success === false) {
    // The data is invalid
    $json_response = [
        'validation_errors' => [
            'field_name' => array('error_message_1','error_message_2'),
            'second_field_name' => array('error_message')
            // etc.
        ]
    ]);
} else {

    // Here we write the code you need to perform on a server..

    // And prepare a response to the client teams:
    $json_response = [
        'redirect' => '/registration_success'
    ];
}

// Returns the response to the client
echo json_encode($json_response);
```

## Command handlers from the server
Initially, the library supports the following commands that you can send it to the server:

| Team | Description | Options |
| ------------- | ---------|--------------|
| `validation_errors`  | Display validation errors  | The object where the keys - the names of the fields, values - array errors. Or just a string, then it will be displayed next to the submit button  |
| `redirect`  | Perform redirect the user to another page  | URL of the page |
| `refresh` | Reload current page  | No opts |
| `nothing`  | Do nothing | No opts |
| `success`  | Display the message about success | `{ title: 'Title', text: 'Message text'  }` |
| `warning`  | Display the message about danger | `{ title: 'Title', text: 'Message text'  }` |
| `info`  | Display the informative message | `{ title: 'Title', text: 'Message text'  }` |
| `error`  | Display an error message | `{ title: 'Title', text: 'Message text'  }` |

For commands `success`,` warning`, `info` and` error` do the following: if your site have a [SweetAlert](https://github.com/t4t5/sweetalert) library, it will be involved in their implementation.

Example of adding your own event handler:
```javascript
PrettyForms.Commands.registerHandler('command_name', function (data) {
  // We do everything here that I want to become.
  // data - an object with data that is sent to us server
});
```

## Format of client-server communication protocol
The client library expects the server response in the following format:
```javascript
{
  command_name_1 : "params",
  command_name_2 : "params"
}
```

To display validation errors, you must send the following response to the client:
```javascript
{
  validation_errors: {
    form_field_1: ["the text of the error №1", "the text of the error №2"],
    form_field_2: ["the text of the error №1", "the text of the error №2", "the text of the error №3"]
  }
}
```

## API

You can use some of the methods of the library in your own applications.

`PrettyForms.Validator.validate(element)`
> Perform validation of a form. Parameter: jQuery-element.

`PrettyForms.getInputData(elements_container)`
> Collect data from said container, simultaneously checking them all validator. If the validation fails, it returns false instead of the data. Parameter: jQuery-element of which will be collected in all fields.

`PrettyForms.getInputsList(elements_container)`
> Pull out all the INPUT of said container. Parameter: jQuery-selector.

`PrettyForms.sendData(url, mass, input_container_for_clear, input)`
> Send the data to the specified URL and process the response. parameters:
> - URL, which will be sent details
> - The data to be sent to the URL
> - jQuery-element - the container for cleaning INPUT or false
> - jQuery-element - the button, which was committed by a click. It will be made inactive at the time of the request.

## Advanced Setup

PrettyForms originally tuned for sites created based on the Twitter Bootstrap, but you can easily replace it with a template with error messages on their own, redefining three variables in the object "PrettyForms.templates".

During the validation process, the library will automatically create containers for error messages if they are not on the form. For each field, just below it, the container will be created, based on a template located in the `PrettyForms.templates.element_validations_container`. At the time of writing this wiki, the pattern has the form:
```html
<div style="display:none;margin-top:10px" id="validation-error-{%}" class="alert alert-danger" role="alert"></div>
```
This container will be placed error messages when they occur during the test fields. You can place data fields within its own form, in those places where you want, if you do not have automatic generation approached for any reason. Just add these containers for each field on the form, with an attribute `id="validation-error-{field_name}"`. For example, if you have on the page `<input name="email"/>`, then it can be created anywhere in the container error: `<div style="display:none;" id="validation-error-email" class="alert alert-danger" role="alert"></div> `. Now the library will find your container and place the error messages in it.

Also, the library will automatically generate a container for common error messages validation. He will be placed immediately before the submit button, he is taken from the template variable `PrettyForms.templates.form_validation_messages`. At the time of writing wiki template is as follows:
```html
<div style="margin-bottom:10px" class="validation-errors alert alert-danger"></div>
```
You can also place the container by hand in the place form where you will be most comfortable. To help find your container, add it to a class `.validation-errors`.

## Known Issues

Currently, one of the problems - the inability to collect the INPUT for the types that have been described [in the standards HTML5](http://www.w3schools.com/html/html_form_input_types.asp), although their support can be easily added to the library but at the moment I just have not encountered this need.

One of the frequent problems - it is difficult to obtain the contents of those fields, which applied some additional plug-like or Chosen CKEDitor. Specifically, for these two plug-ins in the library has built-in support, and she gets the correct values of the fields associated with these plug-ins, but in the world there are thousands of other plug-ins, with which it can work properly. Keep in mind when using this library.

#PrettyForms. Русская документация
===========

Небольшая библиотека, благодаря которой можно легко сделать валидацию формы на клиентской и серверной сторонах. Изначально настроена для работы с [Twitter Bootstrap](http://getbootstrap.com).

Зависимости: jQuery.

[Скринкаст работы библиотеки](demo.gif)

## Установка
Вы можете скачать zip-архив с библиотекой, либо установить её через bower:
```shell
bower install prettyforms --save
```

*Подсказка:* для дополнительного увеличения удобства пользования вашим сайтом, вы можете подключить также плагин [SweetAlert](https://github.com/t4t5/sweetalert), который будет автоматически использоваться библиотекой, если вы подключите её к вашему сайту.

## Алгоритм работы:
1. Пользователь заполняет поля и нажимает кнопку отправки формы. Библиотека проводит валидацию всех данных, и если всё нормально, она собирает все данные формы и отправляет POST-запрос на сервер и ожидает от него JSON-ответ в специальном формате.
2. Сервер, получив запрос, проводит дополнительную валидацию данных уже на своей стороне. Если возникли ошибки при серверной валидации, он возвращает клиенту специальным образом сформированный JSON-ответ, содержащий команду для отображения ошибок серверной валидации с информацией о полях и содержащихся в них ошибках.
3. Если данные успешно прошли валидацию и на сервере, сервер производит необходимые операции и возвращает JSON-ответ с командами, описывающими действия, которые клиентская машина должна выполнить после успешной обработки операции.

То есть, сервер всегда отвечает определённым набором команд для браузера, а браузер просто исполняет данные команды на клиенской машине. Таков алгоритм работы библиотеки.

## Пример использования

Подключите JS-файл `prettyforms.js` на страницу сайта и добавьте атрибут валидации `data-validation=""` со списком правил валидации ко всем полям вашей формы. После добавления правил, поля формы автоматически станут валидироваться библиотекой PrettyForms. Если данные окажутся невалидными, библиотека не даст форме отправиться на сервер. Это минимальный функционал библиотеки, без связки с сервером.

Для того чтобы подключить библиотеку для работы с сервером, добавьте к вашей стандартной кнопке отправки формы класс `senddata`, благодаря которому клики по кнопке будут перехвачены и обработаны библиотекой. Теперь библиотека не только будет производить клиентскую валидацию, но и станет отвечать за отправку данных на сервер и обработку ответа.

Пример формы для Bootstrap-фреймворка с атрибутами валидации:

```html
<form class="form-horizontal" role="form" method="POST" action="/register">
    <h1 class="form-signin-heading">Регистрация</h1>
    <div class="form-group">
        <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
        <div class="col-sm-10">
            <input type="email"
                   class="form-control"
                   id="inputEmail3"
                   name="email"
                   data-validation="notempty;isemail"
                   placeholder="Введите ваш email">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword3" class="col-sm-2 control-label">Пароль</label>
        <div class="col-sm-10">
            <input
                type="password"
                class="form-control"
                id="inputPassword3"
                name="password"
                data-validation="notempty;minlength:6"
                placeholder="Ваш пароль">
        </div>
    </div>
    <div class="form-group">
        <label for="inputPassword4" class="col-sm-2 control-label">Повторите пароль</label>
        <div class="col-sm-10">
            <input type="password"
                   class="form-control"
                   id="inputPassword4"
                   name="password_retry"
                   data-validation="notempty;passretry"
                   placeholder="Повторите пароль, вдруг ошиблись при вводе? Мы проверим это.">
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <div class="btn btn-default senddata">Зарегистрироваться</div>
        </div>
    </div>
</form>
```

## Валидаторы полей

Правила валидации разделяются знаком `;`, параметры для правил передаются через знак `:`.
Пример корректного списка правил, содержащего два правила, одно из них с параметром: `"notempty;minlength:6"`

| наименование  | Описание      | Параметр|
| ------------- | ------------- |---------|
| notempty  | Поле не может быть пустым. Если это набор radio-инпутов, то один из них должен быть помечен.  | - |
| minlength  | Не менее {%} символов  | кол-во символов |
| maxlength  | Не более {%} символов  | кол-во символов |
| hasdomain  | Адрес должен начинаться с верного домена ({%})  | домен |
| isnumeric  | Поле может содержать только цифры  | - |
| isemail  | Должен быть введен корректный E-Mail  | - |
| isdate  | Поле должно содержать дату  | - |
| isphone  | Поле должно содержать номер телефона  | - |
| minint  | Минимальное вводимое число {%}  | число |
| maxint  | Максимальное вводимое число {%}  | число |
| intonly  | Можно ввести только число  | число |
| passretry  | Должно быть равно полю с паролем  | наименование поля с паролем, по-умолчанию "password" |
| checked  | Проверить, что на checkbox-элементе стоит галочка. Используется для необходимости согласиться с условиями лицензии, например.  | - |

#### Добавление своего валидатора
Вы можете легко добавить свои собственные валидаторы, используя подобный пример:
```javascript
$(window).load(function(){
  PrettyForms.Validator.setValidator('needempty', 'Поле должно быть пустым!', function(element, value, param){
      // needempty - название валидатора
      // второй параметр - сообщение об ошибке
      // третий - это сама функция валидации, в которую передаются три параметра: jQuery-элемент, значение элемента и параметр валидатора, если он был передан в свойствах валидации
      return value === '';
  });
});
```

#### Дополнительные атрибуты валидации
Библиотека также позволяет добавлять к полям некоторые дополнительные атрибуты, которые регулируют поведение проверки поля.

| атрибут       | Описание      | Обязательно?|
| ------------- | ------------- |-------------|
| data-dontsend="true"  | Отключает проверку данного поля и его отправку на сервер | Нет |


## Атрибуты кнопки отправки формы
Кнопка, нажатие на которую генерирует отправку формы, может также иметь несколько дополнительных атрибутов, объясняющих, куда должны быть отправлены данные, из какого DOM-элемента они должны быть собраны, и некоторые другие свойства поведения формы. Если атрибуты не были указаны, данные будут взяты из вашей формы.

| атрибут       | Описание | Обязательно? |
| ------------- | ---------|--------------|
| data-input  | jQuery-селектор элемента, из которого будут собраны данные для отправки на сервер  | Нет, если не указано, то будет сделана попытка вытащить данные из формы, в которой лежит кнопка. Если формы не было найдено, будет отправлен запрос без данных. |
| href или data-link  | Адрес, на который будут отправлены данные  | Нет, по умолчанию данные будут взяты из атрибута action формы, если же и там пусто, то они будут отправлены на текущий URL страницы |
| data-clearinputs="true" | Очистить поля формы после успешного выполнения запроса?  | Нет |
| class="... really"  | Позволяет задать вопрос перед отправкой данных. Если к сайту подключён плагин [SweetAlert](https://github.com/t4t5/sweetalert), он будет задействован. | Нет |
| data-really-text=""  | Текст вопроса, по умолчанию берется из `PrettyForms.messages.really` | Нет |
| data-really-text-btn=""  | Текст кнопки, нажатие на которую вызовет выполнение действия. По-умолчанию, текст берется из `PrettyForms.messages.really_agree` | Нет |

## Валидация на сервере
Валидацией на сервере должен заниматься тот фреймворк, с которым вы работаете. Библиотека ожидает в качестве ответа объект, ключи которого - это названия команд, а значения - это параметры команды. Так, команда отображения ошибок валидации называется `validation_errors`, а в качестве её параметров должен быть указан уже другой объект, ключами которого являются названия полей, а в качестве их значений должны содержаться одномерные массивы с текстами ошибок валидации, которые были не пройдены.

Говоря другими словами, логика должна быть примерно следующая: если валидация полей не прошла, то сервер возвращает JSON-ответ с командой отображения ошибок. Если же валидация прошла успешно, сервер возвращает JSON-ответ с другими командами, например, редиректит пользователя на страницу сообщения об успешной регистрации. Пример подготовки ответа на PHP:
```php
// Валидируем данные, сохраняем результат валидации в $validation_success

if ($validation_success === false) {
    // Данные невалидны
    $json_response = [
        'validation_errors' => [
            'field_name' => array('error_message_1','error_message_2'),
            'second_field_name' => array('error_message')
            // и так далее
        ]
    ]);
} else {

    // Здесь пишем тот код, который нужно выполнить на сервере..

    // И подготавливаем клиенту ответ с командами:
    $json_response = [
        'redirect' => '/registration_success'
    ];
}

// Возвращает ответ клиенту
echo json_encode($json_response);
```

## Laravel 5

Для Laravel был создан специальный компонент, который сильно расширяет его возможности и использует для клиентской валидации данную библиотеку. Более подробно вы можете почитать об этом на [странице данного компонента](https://github.com/believer-ufa/prettyforms-laravel).

## Обработчики команд с сервера
Изначально библиотека поддерживает следующие команды, которые можно отправлять ей с сервера:

| команда       | Описание | Параметры |
| ------------- | ---------|--------------|
| `validation_errors`  | Вывести ошибки валидации  | Объект, где ключи - названия полей, значения - массивы с ошибками. Либо просто строка, тогда она будет выведена рядом с кнопкной отправки формы  |
| `redirect`  | Произвести редирект пользователя на другую страницу  | URL страницы |
| `refresh` | Обновить текущую страницу  | Нет |
| `nothing`  | Ничего не делать | Нет |
| `success`  | Вывести сообщение об успехе | `{ title: 'Заголовок', text: 'Текст сообщения'  }` |
| `warning`  | Вывести сообщение об опасности | `{ title: 'Заголовок', text: 'Текст сообщения'  }` |
| `info`  | Вывести информативное сообщение | `{ title: 'Заголовок', text: 'Текст сообщения'  }` |
| `error`  | Вывести сообщение об ошибке | `{ title: 'Заголовок', text: 'Текст сообщения'  }` |

Для команд `success`, `warning`, `info` и `error` действительно следующее: если к вашему сайту будет подключён плагин [SweetAlert](https://github.com/t4t5/sweetalert), то он будет задействован при их выполнении.

Пример добавления собственного обработчика события:
```javascript
PrettyForms.Commands.registerHandler('command_name', function (data) {
  // делаем здесь всё, что хочем.
  // data - это объект с данными, которые отправил нам сервер
});
```

## Формат протокола общения клиента с сервером
Клиентская библиотека ожидает от сервера ответ в следующем формате:
```javascript
{
  command_name_1 : "params",
  command_name_2 : "params"
}
```

Для отображения ошибок валидации, необходимо послать клиенту следующий ответ:
```javascript
{
  validation_errors: {
    form_field_1: ["текст ошибки №1", "текст ошибки №2"],
    form_field_2: ["текст ошибки №1", "текст ошибки №2", "текст ошибки №2"]
  }
}
```

## API

Вы можете использовать некоторые методы библиотеки в своих собственных приложениях.

`PrettyForms.Validator.validate(element)`
> Провести валидацию элемента формы. Параметр: jQuery-элемент.

`PrettyForms.getInputData(elements_container)`
> Собрать данные из указанного контейнера, попутно проверив всех их валидатором. Если валидация провалилась, возвращает false вместо данных. Параметр: jQuery-элемент, из которого будут собраны все поля.

`PrettyForms.getInputsList(elements_container)`
> Вытащить все инпуты из указанного контейнера. Параметр: jQuery-селектор.

`PrettyForms.sendData(url, mass, input_container_for_clear, input)`
> Отправить данные на указанный URL и обработать ответ. Параметры:
> - URL, на который будут отправлены данные
> - Данные, которые будут отправлены на URL
> - jQuery-элемент - контейнер для очистки инпутов, либо false
> - jQuery-элемент - кнопка, на которую был совершён клик. Она будет сделана неактивной на время запроса.

## Расширенная настройка

PrettyForms изначально заточена под сайты, созданные на основе Twitter Bootstrap, но вы легко можете заменить её шаблоны с сообщениями об ошибках на свои собственные, переопределив три переменных в объекте "PrettyForms.templates".

Во время процесса валидации, библиотека автоматически создаст контейнеры для сообщений об ошибках, если они отсутствуют на форме. Для каждого поля, сразу же под ним, будет создан контейнер, на основе шаблона, расположенного в `PrettyForms.templates.element_validations_container`. На момент написания этой wiki, шаблон имеет следующий вид:
```html
<div style="display:none;margin-top:10px" id="validation-error-{%}" class="alert alert-danger" role="alert"></div>
```
В этот контейнер будут помещены сообщения об ошибках, если они возникнут во время проверки полей. Вы можете разместить данные поля самостоятельно внутри своей формы, в тех местах, в которых пожелаете, если автоматическая генерация вам не подошла по каким-либо причинам. Просто добавьте подобные контейнеры для каждого поля на форме, с атрибутом `id="validation-error-{название_поля}"`. Например, если у вас есть на странице `<input name="email" />`, то для него можно создать в любом месте контейнер ошибок: `<div style="display:none;" id="validation-error-email" class="alert alert-danger" role="alert"></div>`. Теперь библиотека найдёт ваш контейнер и поместит сообщения об ошибках в него.

Также, библиотека автоматически сгенерирует контейнер для общих сообщений об ошибках валидации. Он будет размещен сразу же перед кнопкой отправки формы, его шаблон берется из переменной `PrettyForms.templates.form_validation_messages`. На момент написания вики, шаблон имеет следующий вид:
```html
<div style="margin-bottom:10px" class="validation-errors alert alert-danger"></div>
```
Вы также можете разместить этот контейнер вручную в том месте формы, в котором вам будет наиболее удобно. Чтобы библиотека нашла ваш контейнер общих ошибок, добавьте ему класс `.validation-errors`.

## Известные проблемы

В данный момент, одна из проблем - это невозможность собирать инпуты с теми типами, которые были описаны [в стандартах HTML5](http://www.w3schools.com/html/html_form_input_types.asp), хотя их поддержку можно легко добавить в библиотеку, но в данный момент у меня просто не возникало данной необходимости.

Одна из частых проблем - это трудности с получением содержимого из тех полей, к которым применён какой-то дополнительный плагин, вроде Chosen или CKEDitor. Конкретно для двух этих плагинов в библиотеке уже встроена поддержка, и она корректно получает значения из полей, связанных с данными плагинами, но в мире существуют тысячи других плагинов, с которыми она может работать некорректно. Следует учитывать это при использовании библиотеки.

