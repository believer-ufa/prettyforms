PrettyForms
===========

Небольшая библиотека, благодаря которой можно легко сделать валидацию формы на клиентской и серверной сторонах. Изначально настроена для работы с [Twitter Bootstrap](http://getbootstrap.com).

Зависимости: jQuery.

[Скринкаст работы библиотеки](demo.gif)

####Статьи на хабрахабре:
1. [PrettyForms — простая клиент-серверная валидация форм](http://habrahabr.ru/post/243637/)
2. [Динамичное веб-приложение на основе Laravel, PrettyForms и Backbone.js](http://habrahabr.ru/post/243925/)

Вся дополнительная информация доступна в разделе [wiki](https://github.com/believer-ufa/prettyforms/wiki).

- [Установка](https://github.com/believer-ufa/prettyforms/wiki/1.-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0)
- [Алгоритм работы библиотеки](https://github.com/believer-ufa/prettyforms/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B8)
- [API](https://github.com/believer-ufa/prettyforms/wiki/API)
- [Пример использования](https://github.com/believer-ufa/prettyforms/wiki/2.-%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B8)
  1. [Расширенная настройка](https://github.com/believer-ufa/prettyforms/wiki/2.1-%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F-%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0)
- [Валидаторы полей](https://github.com/believer-ufa/prettyforms/wiki/3.-%D0%92%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%82%D0%BE%D1%80%D1%8B-%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9)
  1. [Добавление своих валидаторов](https://github.com/believer-ufa/prettyforms/wiki/3.1-%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D0%B2%D0%BE%D0%B8%D1%85-%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2)
- [Дополнительные атрибуты валидации](https://github.com/believer-ufa/prettyforms/wiki/4.-%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D1%8B-%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%86%D0%B8%D0%B8)
- [Атрибуты кнопки отправки формы](https://github.com/believer-ufa/prettyforms/wiki/5.-%D0%90%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82%D1%8B-%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D1%8B)
- [Валидация на сервере](https://github.com/believer-ufa/prettyforms/wiki/6.-%D0%92%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%86%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B5)
- [Laravel](https://github.com/believer-ufa/prettyforms/wiki/7.-Laravel)
- [Обработчики команд с сервера](https://github.com/believer-ufa/prettyforms/wiki/8.-%D0%9E%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA%D0%B8-%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4-%D1%81-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0)
- [Формат протокола общения клиента с сервером](https://github.com/believer-ufa/prettyforms/wiki/9.-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0%D1%82-%D0%BF%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0-%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0-%D1%81-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%BC)
- [Защита от CSRF](https://github.com/believer-ufa/prettyforms/wiki/10.-%D0%97%D0%B0%D1%89%D0%B8%D1%82%D0%B0-%D0%BE%D1%82-CSRF)
- [Известные проблемы](https://github.com/believer-ufa/prettyforms/wiki/%D0%9F%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B)

