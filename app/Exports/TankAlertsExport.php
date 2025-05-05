<?php

namespace App\Exports;

use App\Models\FuelTank;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class TankAlertsExport implements WithTitle, WithHeadings, FromQuery
{
    private $fuelTank;
    private $startDate;
    private $endDate;

    public function __construct($fuelTank, $startDate, $endDate) {
        $this->fuelTank = $fuelTank;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * @return string
     */
    public function title(): string {
        return $this->fuelTank->tank_identifier;
    }

    public function headings(): array {
        return [
            'Alert Type',
            'MQ2 Value',
            'BMP180 Value',
            'Alert Message',
            'Resolution Status',
            'Triggered At',
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
            ])
            ->where('fuel_tanks.id', $this->fuelTank->id)
            ->whereBetween('alerts.triggered_at', [$this->startDate, $this->endDate])
            ->orderBy('alerts.triggered_at', 'asc');
    }
}
