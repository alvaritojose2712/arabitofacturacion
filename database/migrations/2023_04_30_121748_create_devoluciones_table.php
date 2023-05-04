<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDevolucionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('devoluciones', function (Blueprint $table) {
            $table->increments('id');

            $table->integer("id_producto")->unsigned();
            $table->foreign('id_producto')->references('id')->on('inventarios')
            ->onDelete("cascade")
            ->onUpdate("cascade");

            $table->string("motivo");
            $table->string("cantidad",10);
            $table->integer("tipo"); //1 Entrada | 0 Salida | 2 interno
            $table->string("categoria"); //1 Garantia | 2 Cambio

            $table->integer("id_vendedor")->unsigned();
            $table->foreign('id_vendedor')->references('id')->on('usuarios');
            
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
        Schema::dropIfExists('devoluciones');
    }
}