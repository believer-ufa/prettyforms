<?php

namespace PrettyForms;
use Illuminate\Support\Facades\Response;
use PrettyForms\Commands;

// Class for generating Laravel response object with correct output for JS library
class LaravelResponse {

    static function generate($commands) {
        $output = Commands::generate($commands);
        $response = Response::make($output, 200);
        $response->header('Content-Type', 'application/json');
        return $response;
    }

}
