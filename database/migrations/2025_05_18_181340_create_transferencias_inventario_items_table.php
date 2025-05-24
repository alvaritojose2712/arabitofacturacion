<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferenciasInventarioItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transferencias_inventario_items', function (Blueprint $table) {
            $table->increments('id');
            
            $table->integer("id_transferencia")->unsigned();
            $table->foreign('id_transferencia')->references('id')->on('transferencias_inventarios')
            ->onDelete('cascade')
            ->onUpdate('cascade');

            $table->unsignedInteger("id_producto");
            $table->foreign('id_producto')->references('id')->on('inventarios')
            ->onDelete('cascade')
            ->onUpdate('cascade');

            $table->decimal("cantidad",13,3);
            $table->decimal("cantidad_original_stock_inventario",13,3);

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
        Schema::dropIfExists('transferencias_inventario_items');
    }
}
