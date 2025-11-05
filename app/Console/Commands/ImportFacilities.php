<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Facility;
use App\Models\District;
use Illuminate\Support\Facades\Storage;

class ImportFacilities extends Command
{
    protected $signature = 'facilities:import';
    protected $description = 'Import facilities from CSV and auto-create districts';

    public function handle()
    {
        $path = storage_path('app/facilities.csv');

        if (!file_exists($path)) {
            $this->error('CSV file not found at: ' . $path);
            return;
        }

        $csv = array_map('str_getcsv', file($path));

        // Normalize headers to lowercase and trim spaces
        $headers = array_map(function ($header) {
            return strtolower(trim($header));
        }, $csv[0]);

        unset($csv[0]);

        foreach ($csv as $row) {
            $rowData = array_combine($headers, $row);

            if (!isset($rowData['facility name'])) {
                $this->warn("Skipping row: missing 'Facility Name'");
                continue;
            }

            // Auto-create district if it doesn't exist
            $districtName = $rowData['district'] ?? null;
            $district = $districtName
                ? District::firstOrCreate(['name' => $districtName], ['region' => 'Unknown'])
                : null;

            Facility::updateOrCreate(
                ['name' => $rowData['facility name']],
                [
                    'title' => $rowData['title'] ?? null,
                    'district_id' => $district?->id,
                    'sub_district' => $rowData['sub-district'] ?? null,
                    'type' => strtolower($rowData['facility type'] ?? 'unknown'),
                    'level_of_care' => $rowData['level of care'] ?? null,
                ]
            );
        }

        $this->info('Facilities and districts imported successfully.');
    }
}
