<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagoPedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pago_pedidos', function (Blueprint $table) {
            $table->increments('id');

            $table->enum('tipo', ['1', '2', '3', '4', '5', '6']); 
               // 1 Transferencia
               // 2 Debito 
               // 3 Efectivo 
               // 4 Credito  
               // 5 Otros
               // 6 vuelto
            $table->decimal("monto",8,2);
            $table->boolean('cuenta')->default(1);
            // 1 es credito 
            // 0 es abono 


            $table->integer("id_pedido")->unsigned();
            $table->foreign('id_pedido')->references('id')->on('pedidos')
            ->onDelete('cascade')
            ->onUpdate('cascade');

            $table->timestamps();

            $table->unique(["tipo","id_pedido"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pago_pedidos');
    }
}
