<?php

namespace PrettyForms;

// Class for return correct answers to JS library
class Commands {

    /**
     * Generate response with commands
     * @param array $commands
     */
    static function generate($commands) {
        $output = [];
        foreach($commands as $command_name => $command_data) {
            $output[] = [
                'type' => $command_name,
                'data' => $command_data
            ];
        }
        return $output;
    }

    /**
     * Generate validation errors array
     * @param array $messages
     * @return array
     */
    static function generateValidationErrors($messages) {
        if (is_array($messages)) {
            $output = [];
            foreach($messages as $field => $errors) {
                $output[] = [
                    'field' => $field,
                    'errors' => $errors
                ];
            }
            return $output;
        } else {
            return $messages;
        }
    }

}
