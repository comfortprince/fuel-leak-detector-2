<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Alert Triggered</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
    @php
        $color = '';
        if($policy->alert_type === 'warning'){
            $color = 'rgb(169, 113, 0)';
        } else if($policy->alert_type === 'critical') {
            $color = '#e3342f';
        } else {
            $color = 'rgb(0, 59, 169)';
        }
    @endphp

    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: {{ $color }};">🚨 Alert Triggered: {{ ucfirst($policy->alert_type) }}</h2>

        <p><strong>Tank:</strong> {{ $tank->tank_identifier }} ({{ $tank->location }})</p>
        <p><strong>Triggered At:</strong> {{ now()->toDateTimeString() }}</p>
        <a href="https://www.google.com/maps/dir/?api=1&destination={{ $tank->gps_latitude }},{{ $tank->gps_longitude }}" target="_blank">
            <strong>Directions to:</strong> {{ $tank->tank_identifier }}
        </a>

        <hr>

        <h4>🔍 Sensor Readings</h4>
        <ul>
            <li><strong>MQ2 Value:</strong> {{ $mq2Reading->value . ' ppm' }} (Recorded at {{ $mq2Reading->recorded_at }})</li>
            <li><strong>BMP180 Value:</strong> {{ $bmp180Reading->value . ' Pa' }} (Recorded at {{ $bmp180Reading->recorded_at }})</li>
        </ul>

        <hr>

        <p><strong>Alert Message:</strong> {{ $policy->alert_message }}</p>

        <p style="margin-top: 20px;">Please take immediate action if necessary. Visit your dashboard for more details.</p>

        <a href="{{ url('/alerts') }}" style="display: inline-block; background-color: #e3342f; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Alerts</a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated message from the FLDS Monitoring System.</p>
    </div>

</body>
</html>