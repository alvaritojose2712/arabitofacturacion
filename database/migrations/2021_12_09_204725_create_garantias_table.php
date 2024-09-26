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
            
            
            
            $table->decimal("cantidad_salida",8,2)->nullable();
            $table->text("motivo_salida")->nullable();

            $table->integer("ci_cajero")->nullable();
            $table->integer("ci_autorizo")->nullable();
            $table->integer("dias_desdecompra")->nullable();
            $table->integer("ci_cliente")->nullable();
            $table->string("telefono_cliente",20)->nullable();
            
            $table->string("nombre_cliente")->nullable();
            $table->string("nombre_cajero")->nullable();
            $table->string("nombre_autorizo")->nullable();
            $table->string("trajo_factura")->nullable();
            $table->string("motivonotrajofact")->nullable();

            $table->integer("numfactoriginal")->nullable();
            $table->integer("numfactgarantia")->nullable();


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
