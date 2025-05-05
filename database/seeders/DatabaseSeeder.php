<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        if(User::count() === 0){
            // Add supervisor
            $owner = User::factory()->create([
                'name' => 'Lynn',
                'email' => 'lynn.flds.system@gmail.com',
                'password' => 'password'
            ]);

            // Add surbodinates
            User::factory()->create([
                'name' => 'Jane',
                'email' => 'jane.flds.system@gmail.com',
                'password' => 'password',
                'role' => 'admin',
                'owner_id' => $owner->id
            ]);

            User::factory()->create([
                'name' => 'Peter',
                'email' => 'peter.flds.system@gmail.com',
                'password' => 'password',
                'role' => 'IT',
                'owner_id' => $owner->id
            ]);
        }
        
        $this->call([
            FuelTankSeeder::class,
            SensorSeeder::class,
            AlertPolicySeeder::class,
            SensorReadingSeeder::class,
            AlertSeeder::class,
        ]);
    }
}
