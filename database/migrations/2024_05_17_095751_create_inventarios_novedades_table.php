<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventariosNovedadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventarios_novedades', function (Blueprint $table) {
            $table->increments('id');

            $table->integer("id_producto")->unsigned()->nullable(true);
            $table->foreign('id_producto')->references('id')->on('inventarios')->onUpdate("cascade");

            $table->string("codigo_barras")->nullable()->default(null);
            $table->string("codigo_proveedor")->nullable()->default(null);
            $table->string("descripcion")->nullable()->default(null);
            $table->decimal("precio_base",8,3)->nullable()->default(0);
            $table->decimal("precio",8,3)->default(0);
            $table->decimal("cantidad",9,2)->default(0);

            $table->integer('id_proveedor')->nullable(true)->default(null);
            $table->integer('id_categoria')->nullable(true)->default(null);


            $table->decimal("iva",9,2)->default(0);

            $table->string("responsable");
            $table->string("motivo");
            $table->integer("estado");

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
        Schema::dropIfExists('inventarios_novedades');
    }
}
