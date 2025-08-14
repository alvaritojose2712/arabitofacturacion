<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\sendCentral;

class Comovamos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'comovamos:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enviar datos a comovamos';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        (new sendCentral)->sendComovamos();
    }
}
