<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCierresPuntosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cierres_puntos', function (Blueprint $table) {
            $table->increments('id');
            $table->date("fecha");

            $table->string('categoria')->nullable(true)->default(null);
            $table->string('descripcion');
            $table->string('banco');
            $table->decimal("monto",8,2);
                       
            $table->integer("id_usuario")->unsigned();
            $table->foreign('id_usuario')->references('id')->on('usuarios');
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
        Schema::dropIfExists('cierres_puntos');
    }
}
