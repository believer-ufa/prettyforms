---
currentMenu: example
---

## Примеры использования

Библиотека автоматически перехватывает любые формы и валидирует в них поля.

Добавьте атрибуты валидации `data-validation=""` со списками правил валидации к нужным полям вашей формы.
При отправке формы, если данные окажутся невалидными, библиотека не даст ей отправиться на сервер.
Это минимальный функционал библиотеки, без связки с сервером.

Чтобы библиотека самостоятельно отправляла форму на сервер, просто добавьте к вашей стандартной кнопке отправки формы
класс `senddata`, благодаря которому клики по кнопке будут перехвачены и обработаны библиотекой.
Теперь библиотека не только будет производить клиентскую валидацию, но и станет отвечать за
отправку данных на сервер и обработку ответа.

Пример подобной формы:

```html
<form method="POST" action="/register">
    <h1>Регистрация</h1>

    <label>Email</label>
    <input type="email" name="email" data-validation="notempty;isemail">

    <label>Пароль</label>
    <input type="password" name="password" data-validation="notempty;minlength:6">

    <button class="senddata">Зарегистрироваться</button>
</form>
```

Попробуйте подобную форму на деле:

<form method="POST" action="/register">
    <label>Email</label>
    <input type="email" name="email" data-validation="notempty;isemail">

    <label>Пароль</label>
    <input type="password" name="password" data-validation="notempty;minlength:6">

    <br/><br/>
    <button class="senddata">Зарегистрироваться</button>
</form>

<p></p>

Другие примеры:

1. [Простая форма](../../demo/simple-form.html)
2. [Горизонтальная Bootstrap форма](../../demo/horizontal-forms-input-group-addons.html)
3. [Использование сторонних плагинов](../../demo/plugins.html)