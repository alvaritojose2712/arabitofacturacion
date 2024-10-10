<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacturasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->increments("id");

            $table->integer("id_proveedor")->nullable(true);
            $table->integer("id_usuario");
            $table->string("numfact");
            $table->string("numnota")->nullable(true)->default(null);
            $table->string("descripcion");
            $table->decimal("subtotal",10,2)->nullable()->default(0);
            $table->decimal("descuento",10,2)->nullable()->default(0);
            $table->decimal("monto_exento",10,2)->nullable()->default(0);
            $table->decimal("monto_gravable",10,2)->nullable()->default(0);
            $table->decimal("iva",10,2)->nullable()->default(0);
            $table->decimal("monto",10,2)->nullable()->default(0);
            
            $table->date("fechaemision")->nullable(true);
            $table->date("fechavencimiento")->nullable(true);
            $table->date("fecharecepcion")->nullable(true)->default(null);
            
            $table->integer("estatus");
            $table->text("nota")->nullable(true)->default(null);
            $table->integer("id_pedido_central",12)->nullable(true)->default(null);
            
            
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
        Schema::dropIfExists('facturas');
    }
}
