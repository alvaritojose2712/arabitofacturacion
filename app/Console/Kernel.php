<?php

namespace App\Console;

use App\Http\Controllers\sendCentral;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        // $schedule->call("App\Http\Controllers\sendCentral@updateApp")->dailyAt("18:00");

        // $schedule->call("App\Http\Controllers\sendCentral@getMonedaCentral")->twiceDaily(10, 15);

        // $schedule->call("App\Http\Controllers\sendCentral@setFacturasCentral")->dailyAt("15:00");
        // $schedule->call("App\Http\Controllers\sendCentral@setGastos")->dailyAt("15:00");
        // $schedule->call("App\Http\Controllers\sendCentral@setCentralData")->dailyAt("15:00");
        // $schedule->call("App\Http\Controllers\sendCentral@setVentas")->hourly();



        // $schedule->command('database:backup')->daily();

       /*  (new sendCentral)->sendComovamos();

        $schedule->command('database:backup')->twiceDaily(8, 18); */
        
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
