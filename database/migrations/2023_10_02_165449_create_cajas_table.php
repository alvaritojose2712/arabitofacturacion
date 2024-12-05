<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCajasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cajas', function (Blueprint $table) {
            $table->increments("id");
            $table->string("concepto"); 
            $table->integer("categoria");
            $table->decimal("montodolar",10,2)->default(0);
            $table->decimal("dolarbalance",10,2)->default(0); 
            $table->decimal("montobs", 10, 2)->default(0);
            $table->decimal("bsbalance",10,2)->default(0); 
            $table->decimal("montopeso",10,2)->default(0);
            $table->decimal("pesobalance",10,2)->default(0); 
            
            $table->decimal("montoeuro",10,2)->default(0);
            $table->decimal("eurobalance",10,2)->default(0); 
            
            $table->integer("estatus")->default(0);

            $table->integer("id_sucursal_destino")->nullable(true)->default(null);
            $table->integer("id_sucursal_emisora")->nullable(true)->default(null);
            $table->integer("idincentralrecepcion")->nullable(true)->default(null);
            $table->integer("sucursal_destino_aprobacion")->nullable(true)->default(null);

            $table->integer("id_beneficiario")->nullable();
            $table->integer("id_departamento")->nullable();

            $table->date("fecha");
            $table->integer("tipo"); //0 chica // 1 Fuerte  
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
        Schema::dropIfExists('cajas');
    }
}
