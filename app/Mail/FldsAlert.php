<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FldsAlert extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $policy, $tank, $mq2Reading, $bmp180Reading;

    public function __construct($alert)
    {
        $this->policy = $alert->alertPolicy;
        $this->tank = $this->policy->fuelTank;
        $this->mq2Reading = $alert->mq2Reading;
        $this->bmp180Reading = $alert->bmp180Reading;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $email = env('MAIL_FROM_ADDRESS');

        return new Envelope(
            from: new Address($email, 'FLDS'),
            subject: "🚨 {$this->policy->alert_type} Alert Triggered for Tank {$this->tank->identifier}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.alert',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
