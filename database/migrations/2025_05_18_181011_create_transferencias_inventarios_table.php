<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferenciasInventariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transferencias_inventarios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_transferencia_central')->nullable();
            $table->integer('id_destino');
            $table->integer('id_usuario');
            $table->integer('estado');
            $table->text('observacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transferencias_inventarios');
    }
}
