<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatcajasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catcajas', function (Blueprint $table) {
            $table->increments("id");
            $table->string("indice")->nullable(true)->default("");
            $table->string("nombre");
            $table->integer("tipo");
        });

        DB::table("catcajas")->insert([
            ["indice" => "", "nombre"=> "", "tipo" => 0 ],
            ["indice" => "", "nombre"=> "", "tipo" => 1 ],
            ["indice" => 1, "nombre"=> "INGRESO DESDE CIERRE", "tipo" => 0 ],
            ["indice" => 2, "nombre"=> "INGRESO DESDE CIERRE", "tipo" => 1 ],
            
            ["indice" => 3, "nombre"=> "Caja Chica: CAFE Y AZUCAR", "tipo" => 0 ],
            ["indice" => 4, "nombre"=> "Caja Chica: LIMPIEZA Y MANTENIMIENTO", "tipo" => 0 ],
            ["indice" => 5, "nombre"=> "Caja Chica: OTROS (ESPECIFIQUE)", "tipo" => 0 ],
    
            ["indice" => 6, "nombre"=> "Caja Fuerte: PAGO PROVEEDOR", "tipo" => 1 ],
            ["indice" => 7, "nombre"=> "Caja Fuerte NOMINA", "tipo" => 1 ],
            ["indice" => 8, "nombre"=> "Caja Fuerte ALQUILERES", "tipo" => 1 ],
            ["indice" => 9, "nombre"=> "Caja Fuerte OTROS (ESPECIFIQUE)", "tipo" => 1 ],

            ["indice" => 11, "nombre"=> "Caja Chica EFECTIVO ADICIONAL", "tipo" => 0 ],
            ["indice" => 10, "nombre"=> "Caja Fuerte EFECTIVO ADICIONAL", "tipo" => 1 ],
        ]);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catcajas');
    }
}
