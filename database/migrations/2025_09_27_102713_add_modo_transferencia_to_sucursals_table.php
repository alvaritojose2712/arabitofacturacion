<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddModoTransferenciaToSucursalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sucursals', function (Blueprint $table) {
            $table->string('modo_transferencia', 255)->default('central')->after('app_version');
            //codigo, megasoft, central
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sucursals', function (Blueprint $table) {
            $table->dropColumn('modo_transferencia');
        });
    }
}
