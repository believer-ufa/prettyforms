// Class for working with forms on site: validation of a form, sending data to the server and execute commands received from the server
// Класс для работы с формами сайта: валидация элементов формы, отправка данных на сервер и выполнение команд, полученных от сервера
PrettyForms = new function () {

    // Маленькая функция для проверки на присутствие подключённого к элементу плагина CKEditor
    var checkForCkEditor = function(element) {
        var el_id = element.attr('id');
        if (el_id && typeof(CKEDITOR) !== 'undefined')
        {
            return (CKEDITOR.instances[el_id]) ? true : false;
        }
    };


    // HTML-templates used by library
    // HTML-шаблоны, используемые библиотекой
    this.templates = {
        // The container in which to put error messages relating to a particular element
        // Контейнер, в который будут помещены сообщения об ошибках, относящиеся к определённому элементу
        element_validations_container: '<div style="display:none;margin-top:10px" id="validation-error-{%}" class="alert alert-danger" role="alert"></div>',
        // Error message
        // Сообщение об ошибке
        element_validation_message: '<p><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;{%}</p>',
        // A container with a list of common errors related to a form must have a class .validation-errors
        // Контейнер с перечислением общих ошибок, относящихся к форме, обязательно должен иметь класс .validation-errors
        form_validation_messages: '<div style="margin-bottom:10px" class="validation-errors alert alert-danger"></div>'
    };

    // Messages used by library
    // Сообщения, используемые библиотекой
    this.messages = {
        server_error:  'Что-то пошло не так на сервере, и он не смог обработать ваши данные. Мы постараемся исправить это как можно скорее. Пожалуйста, повторите попытку позже.',
        really:        'Действительно выполнить действие?',
        really_agree:  'Выполнить действие',
        really_title:  'Вы уверены?',
        really_cancel: 'Отмена',
        fix_and_retry: 'Пожалуйста, исправьте ошибки в форме и повторите отправку.',
        rules: {
            notempty:  'Поле не может быть пустым.',
            minlength: 'Не менее {%} символов.',
            maxlength: 'Не более {%} символов.',
            hasdomain: 'Адрес должен начинаться с верного домена ({%})',
            isnumeric: 'Поле может содержать только цифры.',
            isemail:   'Должен быть введен корректный E-Mail',
            isurl:     'Должен быть введен корректный URL-адрес сайта.',
            isdate:    'Поле должно содержать дату',
            isphone:   'Введён не корректный формат телефона',
            minint:    'Минимальное вводимое число {%}',
            maxint:    'Максимальное вводимое число {%}',
            intonly:   'Можно ввести только число',
            passretry: 'Должно быть равно полю с паролем',
            checked:   'Должно быть помечено'
        }
    };

    // Small class which is engaged in the implementation of commands received from the server
    // Небольшой класс, который занимается выполнением команд, получаемых с сервера
    this.Commands = new function () {
        this.handlers = {}; // An array of registered handler Command | Массив зарегистрированных обработчиков команд
        this.execute = function (command, params) {
            if (this.handlers[command]) {
                this.handlers[command](params);
            }
        };
        /**
         * Register the handler commands sent from the server to the client after processing
         * Зарегистрировать обработчик команды, отправленной сервером клиенту после обработки данных
         * @param string name
         * @param function action
         */
        this.registerHandler = function (name, action) {
            this.handlers[name] = action;
        };
    };

    // Class facilities to validate the form
    // Класс для валидации объектов формы
    this.Validator = new function () {
        // All validation rules set in the hash, by key will be the name of a validator, the value - the object validator.
        // Все правила валидации засунем в хеш, ключём будет название валидатора, значением - объект валидатор.
        this.validation_rules = {};

        // Validation Rules
        // The validator returns TRUE, if the no error
        // Правила валидации
        // Валидаторы возвращают TRUE, если нет ошибок

        this.validation_rules['notempty'] = function (el, val) {
            if (el.attr('type') === 'radio' || el.attr('type') === 'checkbox') {
                return PrettyForms.form_container.find('input[name="' + el.attr('name') + '"]:checked').length > 0;
            } else {
                return val === null
                    ? false
                    : val.toString().length !== 0;
            }
        };

        this.validation_rules['minlength'] = function (el, val, length) {
            return val.toString().length >= length;
        };

        this.validation_rules['maxlength'] = function (el, val, length) {
            return val.toString().length <= length;
        };

        /*
         Checks the domain name into the input box can take multiple parameters separated by commas
         Проверяет наличие доменного имени в поле ввода, может принимать несколько параметров через запятую.
         domains="http://vk.com, http://vkontakte.ru"
         */
        this.validation_rules['hasdomain'] = function (el, val, domains) {
            if (val == '' || val == '(an empty string)') {
                return true;
            }
            domains = domains.split(',');
            for (var i in domains) {
                if (val.indexOf(domains[i].trim()) != -1)
                    return true;
            }
            return false;
        };

        this.validation_rules['isnumeric'] = function (el, val) {
            if (val == '' || val == '(an empty string)')
                return true;
            return /^[0-9]+$/.test(val);
        };

        this.validation_rules['isemail'] = function (el, val) {
            if (val == '' || val == '(an empty string)')
                return true;
            return /^.+@.+\..{2,9}$/.test(val);
        };

        this.validation_rules['isurl'] = function (el, val) {
            if (val == '' || val == '(an empty string)')
                return true;
            return /^(http|ftp|https):\/\/.+\..{2,9}/.test(val);
        };

        this.validation_rules['isdate'] = function (el, val) {
            if (val == '' || val == '(an empty string)')
                return true;
            if (!/^([0-9]{1,2})(\.|\/)([0-9]{1,2})(\.|\/)([0-9]{4,4})$/.test(val)) {
                return false;
            } else {
                return (parseInt(RegExp.$1) <= 31 && parseInt(RegExp.$3) <= 12 && parseInt(RegExp.$5) < 2500);
            }
        };

        this.validation_rules['isphone'] = function (el, val) {
            if (val == '' || val == '(an empty string)' || val == '(an empty string)')
                return true;
            return /^((8|\+7)?[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(val)
        };

        this.validation_rules['minint'] = function (el, val, minInt) {
            if (val == '' || val == '(an empty string)')
                return true;
            return parseInt(val) >= parseInt(minInt);
        };

        this.validation_rules['maxint'] = function (el, val, minInt) {
            if (val == '' || val == '(an empty string)')
                return true;
            return parseInt(val) <= parseInt(minInt);
        };

        this.validation_rules['intonly'] = function (el, val) {
            if (val == '' || val == '(an empty string)')
                return true;
            return /^[0-9]+$/.test(val);
        };

        this.validation_rules['passretry'] = function (el, val, password_input_name) {
            if (typeof (password_input_name) === 'undefined') {
                password_input_name = 'password'; // By default, the main INPUT password called "password" | По умолчанию осовной инпут с паролем называется "password"
            }
            return val === PrettyForms.form_container.find('input[name="' + password_input_name + '"]').val();
        };

        // Check that checkbox-item is checked, or on one of the elements with the same name
        // Проверить, что на checkbox-элементе стоит галочка, или же на одном из элементов с подобным именем
        this.validation_rules['checked'] = function (el, val) {
            if (el.attr('name').indexOf('[]') === -1) {
                return el.is(':checked');
            } else {
                // If this checkbox array, therefore, among the elements can be labeled with another element.
                // Let's try to look for marked elements on the page of the same name.
                // If we find - we will find it labeled.
                // Если это чекбокс-массив, то следовательно, среди элементов может быть помеченным другой элемент.
                // Попробуем поискать помеченные элементы на странице такого же названия.
                // Если найдем - будем считать его помеченным.
                return (PrettyForms.form_container.find('input[name="' + el.attr('name') + '"]:checked').length > 0);
            }
        };

        /**
         * Add a specific validator
         * Добавить определённый валидатор
         * @param string rule_name The name of the validation rules | Название правила валидации
         * @param function validator_func Validation function | Функция валидации
         * @param string error_message The error message if validation fails | Сообщение об ошибке, если валидация провалилась
         */
        this.setValidator = function(rule_name, error_message, validator_func) {
            this.validation_rules[rule_name] = validator_func;
            PrettyForms.messages.rules[rule_name] = error_message;
        };

        // Return the item that is marked as invalid, and the user sees. Not always is the original INPUT.
        // Вернуть тот элемент, который будет помечен как ошибочный и который видит пользователь.
        // Не всегда это оригинальный инпут.
        this.getMarkingElement = function(el)
        {
            if (el.get(0).tagName === 'SELECT')
            {
                if ($(el).data('select2'))
                {
                    return $(el).data('select2').$container;
                }

                if ($(el).data('chosen'))
                {
                    return $(el).data('chosen').container;
                }
            }

            if (el.get(0).tagName === 'TEXTAREA' && checkForCkEditor(el)) {
                el = $(CKEDITOR.instances[$(el).attr('id')].container.$);
            }

            if (el.attr('type') === 'checkbox' || el.attr('type') === 'radio') {
                el = el.parent().parent();
            }

            return el;
        };

        // Returns the container element errors. If the container is not found,
        // it will be created immediately after the element
        // Возвращает контейнер с ошибками элемента. Если контейнер не найден,
        // он будет создан сразу после элемента
        this.getElementErrorsContainer = function(el) {
            var element_name = el.attr('name');
            var current_el = el.get(0);

            // If the specified object - it is an array, it will have to begin to calculate its number
            // Если указанный объект - это массив, то придётся для начала вычислить его номер
            if (element_name.indexOf('[') !== -1) {
                PrettyForms.form_container.find('[name="'+element_name+'"]').map(function(num) {
                    if (this === current_el) {
                        element_name = element_name.replace('[','').replace(']','') + '-' + num;
                    }
                });
            }

            el = this.getMarkingElement(el);
            var el_errors_container = PrettyForms.form_container.find('#validation-error-' + element_name);

            if (el_errors_container.length === 0) {

                var input_group = el.closest('.input-group');
                if (input_group.length > 0) {
                    el = input_group;
                }

                // If the container was not found errors on a page, add it
                // Если контейнер для ошибок не был найден на странице, добавим его
                el.after(PrettyForms.templates.element_validations_container.replace('{%}', element_name));
                el_errors_container = PrettyForms.form_container.find('#validation-error-' + element_name);
            }
            return el_errors_container;
        };

        // We mark the item as checked (delete error messages)
        // Пометим элемент как проверенный (удалим все сообщения об ошибках)
        this.markElementAsChecked = function(el) {
            var el_errors_container = this.getElementErrorsContainer(el);
            el_errors_container.hide();

            // If INPUT is within .form-group, we will work with him
            // Если инпут находится внутри .form-group, будем работать с ним
            var el_form_group = el.closest('.form-group');
            if (el_form_group.length !== 0) {
                el_form_group.removeClass('has-warning');
                //el_form_group.addClass('has-feedback');
                //el_form_group.addClass('has-success');
                if (el.get(0).tagName === 'INPUT') {
                    el_form_group.find('span.glyphicon').remove();
                    //el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
                }
            } else {
                this.getMarkingElement(el).removeClass('prettyforms-validation-error');
            }
        };

        // Mark an item as containing an error
        // Пометим элемент как содержащий ошибку
        this.markElementAsErroneous = function(el,error_messages,server_error) {
            var el_errors_container = this.getElementErrorsContainer(el);
            el_errors_container.html(error_messages).show();

            if (server_error === true) {
                el.addClass('validation-server-error');
            }

            // If INPUT is within .form-group, we will work with him. Otherwise, add a class .prettyforms-validation-error
            // Если инпут находится внутри .form-group, будем работать с ним. Иначе добавим класс .prettyforms-validation-error
            var el_form_group = el.closest('.form-group');
            if (el_form_group.length !== 0) {
                el_form_group.addClass('has-feedback');
                el_form_group.removeClass('has-success');
                el_form_group.find('span.glyphicon.glyphicon-warning-sign.form-control-feedback').remove();
                if (server_error !== true) {
                    el_form_group.addClass('has-warning');
                    if (el.get(0).tagName === 'INPUT') {
                        el.after('<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>');
                    }
                }
            } else {
                this.getMarkingElement(el).addClass('prettyforms-validation-error');
            }

            el_errors_container.stop().css('opacity', '1').animate({opacity: 0.7}, 1500, 'linear');
        };

        this.validate = function (el) {

            // The function of direct verification element
            // Функция непосредственной проверки элемента
            var checkElement = function (el) {
                var element_validation_rules = el.attr('data-validation').split(';');
                var element_rules_texts = '';
                var isError = false;

                for (var i in element_validation_rules) {
                    var el_validation_rule_name = element_validation_rules[i].toString().trim();

                    el_validation_rule_param = undefined;

                    // Try to get additional validation parameters
                    // Пробуем получить дополнительные параметры валидации
                    if (el_validation_rule_name.match(':')) {
                        var el_validation_rule_param = el_validation_rule_name.split(':');
                        el_validation_rule_name = el_validation_rule_param[0].toString().trim();
                        el_validation_rule_param = el_validation_rule_param[1].toString().trim();
                    }

                    // We reach the validator object by its name and check them object.
                    // Достаём объект-валидатор по его названию и проверяем им объект.
                    var rule = PrettyForms.Validator.validation_rules[el_validation_rule_name];
                    if (typeof (rule) !== 'undefined') {
                        var element_value = el.val();

                        // If it is a large text entry field, and it is attached to the editor CKEditor, it'll take the instance data
                        // Если это поле ввода большого текста, и к нему прикреплен редактор CKEditor, заберём данные его инстанс
                        if (el.get(0).tagName === 'TEXTAREA' && checkForCkEditor(el))
                        {
                            element_value = CKEDITOR.instances[el.attr('id')].getData();
                        }

                        // REMEMBER! VALIDATOR returns TRUE IF THESE validity
                        // ПОМНИ! VALIDATOR ВЕРНЁТ TRUE ЕСЛИ ДАННЫЕ ВАЛИДНЫ
                        var el_validation_result = rule(el, element_value, el_validation_rule_param);
                        if (el_validation_result === false) {
                            isError = true;

                            var rule_text = PrettyForms.messages.rules[el_validation_rule_name].replace('{%}', el_validation_rule_param);
                            element_rules_texts += PrettyForms.templates.element_validation_message.replace('{%}', rule_text);
                        }
                    }
                }

                if (isError) {
                    return element_rules_texts;
                } else {
                    return true;
                }
            };

            // If it is a hidden element, which does not apply a JS-component, like a library, or Chosen, or CKEditor'a - not to check his
            // Если это скрытый элемент, к которому не применен некий JS-компонент, вроде плагина Chosen или CKEditor'а -  то не проверять его
            if (!el.is(':visible')
                    && !el.data('chosen')
                    && !el.data('select2')
                    && !checkForCkEditor(el)
            ) {

                return true;
            }

            // Object does not have validation rules - there is nothing to check
            // У объекта нет правил валидации - нечего проверять
            if (!el.attr('data-validation')) {
                return true;
            }

            // If an item has the class, the server reported an error on it. Disable checking this item.
            // Если элемент имеет данный класс, значит сервер сообщил об ошибке на нём. Отключим проверку этого элемента.
            if (el.hasClass('validation-server-error')) {
                return true;
            }

            // Actually, the verification element
            // Собственно, сама проверка элемента
            var isValid = checkElement(el);

            // The element is checked, no errors
            // Элемент проверен, ошибок нет
            if (isValid === true) {
                PrettyForms.Validator.markElementAsChecked(el);
                return true;
            } else {
                // During the validation of any errors,
                // Mark an item in red and generate small animation
                // Во время валидации элемента возникли ошибки,
                // Пометим элемент красным и сгенерируем небольшую анимацию
                PrettyForms.Validator.markElementAsErroneous(el,isValid);
                return false;
            }
        };
    };
    this.validation_errors_container = null;

    // Collect data from said container, simultaneously checking them all validator
    // Собрать данные из указанного контейнера, попутно проверив всех их валидатором
    this.getInputData = function (inputs_container) {

        this.setFormContainer(inputs_container);

        if (typeof (inputs_container) !== 'undefined' && inputs_container !== '') {
            var form_values = {},
                form_elements = this.getInputsList(inputs_container);

            var form_valid = true;
            form_elements.each(function (el) {
                var form_element = $(this),
                        element_value = undefined;

                if (form_element.attr('name') != undefined && form_element.attr('data-dontsend') !== 'true') {

                    if (!PrettyForms.Validator.validate(form_element)) {
                        if (form_valid) {
                            // We focus on the first wrong element
                            // Сфокусируемся на первом ошибочном элементе
                            PrettyForms.Validator.getMarkingElement(form_element).focus();
                        }
                        form_valid = false;
                    }

                    // If the name is [] then we send the server array
                    // Если имя имеет [] то шлём серверу массив.
                    if (form_element.attr('name').indexOf('[]') !== -1) {
                        if (typeof (form_values[form_element.attr('name')]) === 'undefined') {
                            form_values[form_element.attr('name')] = [];
                        }
                    }

                    if (form_element.attr('type') == 'checkbox' && form_element.is(':checked')) {
                        element_value = form_element.val();
                    } else if (form_element.attr('type') != 'checkbox') {
                        element_value = form_element.val();
                    }

                    // If this textarea, and it is attached editor - get the value of the element through the instance of CKEditor
                    // Если это textarea и к ней прикреплен редактор - получим значение элемента через инстанс CKEditor'а
                    if (form_element.get(0).tagName === 'TEXTAREA' && typeof (CKEDITOR) !== 'undefined' && CKEDITOR.instances[form_element.attr('name')]) {
                        element_value = CKEDITOR.instances[form_element.attr('name')].getData();
                    }

                    if (typeof (form_values[form_element.attr('name')]) === 'object' && typeof (element_value) !== 'undefined') {
                        form_values[form_element.attr('name')].push(element_value);
                    } else if (typeof (element_value) !== 'undefined') {
                        form_values[form_element.attr('name')] = element_value;
                    }
                }
            });

            if (form_valid) {
                return form_values;
            } else {
                return false;
            }
        }
    };

    // Pull out all the INPUT of said container
    // Вытащить все инпуты из указанного контейнера
    this.getInputsList = function (inputs_container) {
        return $(inputs_container).find('input, select, textarea');
    };

    // Set container to the current form of the a certain element
    // Установить в качетве контейнера текущей формы определённый элемент
    this.setFormContainer = function(element) {
        this.form_container = $(element);
    };

    /**
     * Send data to a URL and process the response
     * Отправить данные на определенный URL и обработать ответ
     * @param string url
     * @param object mass
     * @param object input_container (optionally) a container in which you will clear all data entered by INPUT (необязательно) контейнер, в котором необходимо будет очистить все инпуты от введенных данных
     */
    this.sendData = function (url, mass, input_container_for_clear, input) {
        // Deny clicking repeatedly on our button while sending the data goes
        // Запретим кликать повторно на нашу кнопочку, пока идёт отправка данных
        input.attr('disabled', 'disabled').addClass('disabled');
        setTimeout(function(){
            // After 10 seconds, then switch it back to avoid unforeseen situations
            // Через 10 секунд включим её обратно во избежание непредвиденных ситуаций
            input.removeClass('disabled').attr('disabled',null);
        },10000);

        // Later, we include our back button and give the opportunity to click on it
        // Позже включим обратно нашу кнопочку и дадим возможность кликать на неё
        var enableInput = function () {
            input.removeClass('disabled').attr('disabled', null);
        };

        // Clear all of the data in the specified INPUT container
        // Очистить от данных все инпуты в указанном контейнере
        var clearInputData = function (inputs_container) {
            PrettyForms.getInputsList(inputs_container).map(function () {
                var $this = $(this);
                if ($this.attr('type') !== 'hidden') {
                    $this.val('');
                }
            });
        };

        // We check that all elements in the array are true
        // Проверим, что все элементы в массиве равны true
        var all_true = function (arr) {
            var success = true;
            arr.map(function (el) {
                if (el !== true) {
                    success = false;
                }
            });
            return success;
        };

        $.ajax({
            type: "POST",
            url: url,
            data: mass,
            dataType: 'json',
            success: function (data) {
                // Including reverse button to send data
                // Включим обратно кнопку отправки данных
                enableInput();

                // If the server replied, try the command received from him
                // Если сервер ответил, попытаемся выполнить полученные от него команды
                $.each(data, function(command_name, command_params) {
                    try {
                        PrettyForms.Commands.execute(command_name, command_params);
                    } catch (e) {
                        console.log('error in handling message', e);
                    }
                });

                var need_clear_inputs = [];
                need_clear_inputs.push(! data.hasOwnProperty('validation_errors')); // This is not the answer to validate the data sent unclimbed | Это не ответ о непройденной валидации отправленных данных
                need_clear_inputs.push(input_container_for_clear !== false); // The container was specified for INPUT | Контейнер для инпутов был указан

                if (all_true(need_clear_inputs)) {
                    clearInputData(input_container_for_clear);
                }
            },
            error: function (data, status, e) {

                enableInput();

                if (data.status === 422) {
                    // Validation error | Ошибка валидации
                    PrettyForms.Commands.execute('validation_errors', data);
                } else {
                    PrettyForms.Commands.execute('validation_errors', PrettyForms.messages.server_error);
                }
            }
        });
    };
};

$(document).ready(function () {

    // When the form is submitted automatically to validate the data in it
    // При отправке формы автоматически производить валидацию данных в ней
    $('body').on('submit', 'form', function () {
        var form_values = PrettyForms.getInputData(this);
        if (form_values === false) {
            // If during the data collection errors were found validation prevent sending form
            // Если во время сбора данных были обнаружены ошибки валидации, предотвратим отправку формы
            PrettyForms.validation_errors_container = $(this).find('.validation-errors');
            PrettyForms.Commands.execute('validation_errors');
            return false;
        } else {
            return true;
        }
    });

    // We capture clicks on the elements with the class .senddata
    // Перехватим клики на элементы с классом .senddata
    $('body').on('click', '.senddata', function () {
        var clicked_element = $(this);
        var link = clicked_element.attr('href');
        if (typeof (link) === 'undefined' || link === '#')
            link = clicked_element.attr('data-link');

        if (typeof (link) === 'undefined') {
            var form = clicked_element.closest('form');
            if (form.length > 0) {
                link = form.attr('action');
            }
        }

        if (typeof (link) === 'undefined') {
            link = document.location.href;
        }

        var inputs_container = $(clicked_element.attr('data-input'));
        if (inputs_container.length === 0) {
            inputs_container = clicked_element.closest('form');
        }

        if (!clicked_element.hasClass('disabled') && typeof (clicked_element.attr('disabled')) === 'undefined') {

            var execute_action = function() {
                if (inputs_container.length > 0) {

                    PrettyForms.setFormContainer(inputs_container);

                    PrettyForms.validation_errors_container = inputs_container.find('.validation-errors');
                    if (PrettyForms.validation_errors_container.length === 0) {
                        // If the container for validation errors could not be found on the page, add it to the button
                        // Если контейнер для ошибок валидации не был найден на странице, добавим его перед кнопкой
                        clicked_element.before(PrettyForms.templates.form_validation_messages);
                        PrettyForms.validation_errors_container = inputs_container.find('.validation-errors');
                    }
                    PrettyForms.validation_errors_container.html('').hide();

                    $(inputs_container).find('.validation-server-error').removeClass('validation-server-error');

                    var form_values = PrettyForms.getInputData(inputs_container);
                    if (form_values === false) {
                        PrettyForms.Commands.execute('validation_errors');
                    } else {
                        var clearinputs = false;
                        if (clicked_element.attr('data-clearinputs') === 'true') {
                            clearinputs = inputs_container;
                        }

                        PrettyForms.sendData(link, form_values, clearinputs, clicked_element);
                    }
                } else {
                    PrettyForms.validation_errors_container = $('');
                    // If not specified container from which it is necessary to gather information,
                    // simply send a request to the specified URL and process the response.
                    // A container as errors just do rodidelsky button element, which was committed by a click.
                    // Если не был указан контейнер, из которого надо собрать информацию,
                    // то просто отправим запрос на указанный URL и обработаем ответ.
                    // А в качестве контейнера ошибок просто сделаем родидельский элемент кнопки,
                    // по которой был совершён клик.

                    form_values = {};

                    PrettyForms.setFormContainer(clicked_element.parent());

                    PrettyForms.sendData(link, form_values, false, clicked_element);
                }
            };

            if (clicked_element.hasClass('really')) {
                var text = PrettyForms.messages.really;
                if (clicked_element.attr('data-really-text')) {
                    text = clicked_element.attr('data-really-text');
                }

                if (typeof(swal) !== 'undefined') {

                    var text_btn = clicked_element.attr('data-really-text-btn')
                        ? clicked_element.attr('data-really-text-btn')
                        : PrettyForms.messages.really_agree;

                    swal({
                        title:              PrettyForms.messages.really_title,
                        text:               text,
                        type:               "warning",
                        showCancelButton:   true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText:  text_btn,
                        cancelButtonText:   PrettyForms.messages.really_cancel,
                        closeOnConfirm:     true
                    }, function() {
                        execute_action();
                    });
                } else {
                    if (confirm(text)) {
                        execute_action();
                    } else {
                        return false;
                    }
                }
            } else {
                execute_action();
            }

        }

        return false;
    });

    PrettyForms.Commands.registerHandler('validation_errors', function (data) {
        if (PrettyForms.validation_errors_container.length > 0) {
            var html = PrettyForms.messages.fix_and_retry;
            if (typeof(data) !== 'undefined') {
                if (typeof(data) === 'string') {
                    // If the error was passed just a string - display it in general container with error messages
                    // Если в качестве ошибки была передана просто строка - отобразим её
                    // в общем контейнере с сообщениями об ошибках
                    PrettyForms.validation_errors_container.html(data).show();
                } else {
                    var focused = false;

                    $.each(data.responseJSON, function(input_name, errors) {
                        var element = PrettyForms.form_container.find('[name="'+input_name+'"]');
                        if (element.length > 0) {
                            var element_errors_str = '';
                            errors.map(function(error) {
                                var error_text = PrettyForms.templates.element_validation_message.replace('{%}', error);
                                element_errors_str += error_text;
                                html += error_text;
                            });
                            PrettyForms.Validator.markElementAsErroneous(element,element_errors_str,true);
                            if (focused === false) {
                                PrettyForms.Validator.getMarkingElement(element).focus();
                                focused = true;
                            }
                        }
                    });

                    PrettyForms.validation_errors_container.html(html).show();
                }
            } else {
                PrettyForms.validation_errors_container.html(html).show();
            }
        }
    });

    // Redirect to another page
    PrettyForms.Commands.registerHandler('redirect', function (link) {
        if (typeof(link) === 'undefined') {
            link = document.location.href;
        }
        document.location.href = link;
    });

    // Refresh page
    PrettyForms.Commands.registerHandler('refresh', function () {
        document.location.href = document.location.href;
    });

    PrettyForms.Commands.registerHandler('nothing', function () {
        // nothing to do
    });

    PrettyForms.Commands.registerHandler('success', function (data) {
        if (typeof(swal) !== 'undefined') {
            swal(data.title, data.text, "success");
        } else {
            alert(data.title + '\n\n' + data.text);
        }
    });

    PrettyForms.Commands.registerHandler('warning', function (data) {
        if (typeof(swal) !== 'undefined') {
            swal(data.title, data.text, "warning");
        } else {
            alert(data.title + '\n\n' + data.text);
        }
    });

    PrettyForms.Commands.registerHandler('info', function (data) {
        if (typeof(swal) !== 'undefined') {
            swal(data.title, data.text, "info");
        } else {
            alert(data.title + '\n\n' + data.text);
        }
    });

    PrettyForms.Commands.registerHandler('error', function (data) {
        if (typeof(swal) !== 'undefined') {
            swal(data.title, data.text, "error");
        } else {
            alert(data.title + '\n\n' + data.text);
        }
    });
});
