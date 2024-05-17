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

            $table->string("codigo_barras")->unique();
            $table->string("codigo_proveedor")->nullable()->default(null);

            $table->integer("id_proveedor")->unsigned();
            $table->foreign('id_proveedor')->references('id')->on('proveedores');
            

            $table->integer("id_categoria")->unsigned();
            $table->foreign('id_categoria')->references('id')->on('categorias');

            $table->string("id_marca")->nullable()->default("GENÉRICO");

            $table->string("unidad")->nullable()->default("UND");

            $table->string("id_deposito")->nullable()->default(1);

            
            
            $table->string("descripcion");

            $table->decimal("iva",5,2)->nullable()->default(0);

            $table->decimal("porcentaje_ganancia",3,2)->nullable()->default(0);
            $table->decimal("precio_base",8,3)->nullable()->default(0);
            $table->decimal("precio",8,3)->default(0);

            $table->decimal("precio1",8,3)->nullable();
            $table->decimal("precio2",8,3)->nullable();
            $table->decimal("precio3",8,3)->nullable();
            $table->integer("bulto")->nullable();

            $table->integer("stockmin")->nullable();
            $table->integer("stockmax")->nullable();

            $table->decimal("cantidad",9,2)->default(0);

            $table->boolean("push")->nullable()->default(0);

            $table->integer('id_vinculacion')->nullable();
            $table->unique(["id_vinculacion"]);
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
