<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'geniuspay' => [
        'public_key' => env('GENIUSPAY_PUBLIC_KEY'),
        'secret_key' => env('GENIUSPAY_SECRET_KEY'),
        'webhook_secret' => env('GENIUSPAY_WEBHOOK_SECRET'),
        'base_url' => env('GENIUSPAY_BASE_URL', 'https://pay.genius.ci/api/v1/merchant'),
        'checkout_success_url' => env('GENIUSPAY_SUCCESS_URL', env('APP_URL') . '/paiement/succes'),
        'checkout_error_url' => env('GENIUSPAY_ERROR_URL', env('APP_URL') . '/paiement/echec'),
    ],

];
