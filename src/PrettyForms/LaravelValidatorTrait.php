<?php namespace PrettyForms;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use PrettyForms\Commands;

// Trait for extend Laravel models for simple validation mechanizm
trait LaravelValidatorTrait {

    private $errors;

    public function validate($data = null)
    {

        $data = is_null($data) ? Input::all() : $data;

        // make a new validator object
        $validator = Validator::make($data, $this->rules);

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
            return parent::save($options);
        } else {
            if (DB::transactionLevel() == 1) {
                // Rollback started transaction
                DB::rollback();
            }

            $output = Commands::generate([
                'validation_errors' => Commands::generateValidationErrors($this->errors->getMessages())
            ]);
            $response = Response::make($output, 200);
            $response->header('Content-Type', 'application/json');
            $response->send();
            die();
        }
    }
}