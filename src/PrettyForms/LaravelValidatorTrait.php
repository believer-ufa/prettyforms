<?php namespace PrettyForms;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

// Trait for extend Laravel models for simple validation mechanizm
trait LaravelValidatorTrait {

    private $errors;

    public function validate()
    {
        $data = $this->getAttributes();

        if (method_exists($this, 'create_rules') AND method_exists($this, 'update_rules')) {
            $rules = is_null($this->id)
                ? $this->create_rules($data)
                : $this->update_rules($data);
        } elseif (method_exists($this, 'validation_rules') OR property_exists($this, 'validation_rules')) {
            $rules = method_exists($this, 'validation_rules')
                ? $this->validation_rules($data)
                : $this->validation_rules;
        } else {
            // Для совместимости оставим поддержку короткого варианта свойства правил валидации
            $rules = $this->rules;
        }

        $messages = array();
        if (method_exists($this,'validation_messages')) {
            $messages = $this->validation_messages();
        }

        // make a new validator object
        $validator = Validator::make($data, $rules, $messages);

        // check for failure
        if ($validator->fails())
        {
            // set errors and return false
            $this->errors = $validator->errors();
            return false;
        }

        // validation pass
        return true;
    }

    public function errors()
    {
        return $this->errors;
    }

    /**
     * Validate model data and save it, otherwise cancels execution and returns error array to client
     * @param array $options
     * @return type
     */
    public function validateAndSave(array $options = array()) {
        if ($this->validate()) {
            return $this->save($options);
        } else {
            if (DB::transactionLevel() == 1) {
                // Rollback started transaction
                DB::rollback();
            }

            throw (new LaravelValidatorException)->setValidationErrors($this->errors->getMessages());
        }
    }
}