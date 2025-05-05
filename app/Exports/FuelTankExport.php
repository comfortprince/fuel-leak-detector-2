<?php

namespace App\Exports;

use App\Models\FuelTank;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FuelTankExport implements FromQuery, WithHeadings
{
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

    public function headings(): array {
        return [
            'Alert Type',
            'MQ2 Value',
            'BMP180 Value',
            'Alert Message',
            'Resolution Status',
            'Triggered At',
            'MQ2 Recorded At',
            'BMP180 Recorded At',
        ];
    }

    public function query()
    {
        return DB::table('fuel_tanks')
            ->join('alert_policies', 'fuel_tanks.id', '=', 'alert_policies.fuel_tank_id')
            ->join('alerts', 'alert_policies.id', '=', 'alerts.alert_policy_id')
            ->join('sensor_readings as sr_mq2', 'alerts.mq2_reading_id', '=', 'sr_mq2.id')
            ->join('sensor_readings as sr_bmp180', 'alerts.bmp180_reading_id', '=', 'sr_bmp180.id')
            ->select([
                'alert_policies.alert_type',
                'sr_mq2.value as mq2 value',
                'sr_bmp180.value as bmp180 value',
                'alert_policies.alert_message',
                'alerts.resolved',
                'alerts.triggered_at',
                'sr_mq2.recorded_at as mq2_recorded_at',
                'sr_bmp180.recorded_at as bmp180_recorded_at',
            ])
            ->where('fuel_tanks.user_id', 1)
            ->orderBy('alerts.triggered_at', 'desc')
            ->limit(2);
        }
}
