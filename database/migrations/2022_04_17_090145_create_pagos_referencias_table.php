<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagosReferenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos_referencias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('categoria')->nullable(true)->default(null);
            //DEBITO  
            //CREDITO  

            $table->string('tipo'); 
            // 1 Transferencia
            // 2 Debito 
            // 3 Efectivo 
            // 4 Credito  
            // 5 BioPago
            // 6 vuelto
            $table->string('descripcion');
            $table->string('banco');
            $table->decimal("monto",8,2);


            $table->integer("id_pedido")->unsigned();
            $table->foreign('id_pedido')->references('id')->on('pedidos')
            ->onDelete('cascade')
            ->onUpdate('cascade');


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
        Schema::dropIfExists('pagos_referencias');
    }
}
