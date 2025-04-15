<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->increments('id');

            $table->boolean("estado");
            $table->boolean("export")->nullable(true)->default(0);

            $table->date("fecha_inicio")->nullable();
            $table->date("fecha_vence")->nullable();
            $table->boolean("formato_pago")->nullable();
            //Parcial o completo
            //0 Parcial
            //1 Completo
            
            $table->boolean("ticked")->default(0);
            $table->boolean("fiscal")->default(0);
            $table->boolean("retencion")->default(0);

            $table->integer("id_cliente")->unsigned();
            $table->foreign('id_cliente')->references('id')->on('clientes');

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
        Schema::dropIfExists('pedidos');
    }
}
