<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGarantiasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('garantias', function (Blueprint $table) {
            $table->increments('id');

            $table->integer("id_producto")->unsigned()->nullable(true);
            $table->foreign('id_producto')->references('id')->on('inventarios')->onUpdate("cascade");
            
            $table->integer("id_pedido")->unsigned();
            $table->foreign('id_pedido')->references('id')->on('pedidos')->onDelete('cascade')->onUpdate('cascade');

            $table->decimal("cantidad",8,2);
            $table->text("motivo")->nullable();

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
        Schema::dropIfExists('garantias');
    }
}
