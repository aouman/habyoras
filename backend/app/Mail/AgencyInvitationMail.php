<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AgencyInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;
    public string $registerUrl;

    public function __construct(string $name, string $registerUrl)
    {
        $this->name = $name;
        $this->registerUrl = $registerUrl;
    }

    public function build()
    {
        return $this->subject('Rejoignez Habyora en tant qu\'agence')
                    ->markdown('emails.agency-invitation');
    }
}
