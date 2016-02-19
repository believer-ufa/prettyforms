PrettyForms.js
===========

A small library, through which you can easily make the form validation on the client and server sides. Originally set up to work with [Twitter Bootstrap](http://getbootstrap.com).

Depends: jQuery.

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

One of the frequent problems - it is difficult to obtain the contents of those fields, which applied some additional plug-like or Chosen CKEDitor. Specifically, for these two plug-ins in the library has built-in support, and she gets the correct values of the fields associated with these plug-ins, but in the world there are thousands of other plug-ins, with which it can work properly. Keep in mind when using this library.

