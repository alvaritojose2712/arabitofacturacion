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
            ["indice" => 4, "nombre"=> "Caja Chica: CENAS", "tipo" => 0 ],
            ["indice" => 5, "nombre"=> "Caja Chica: COLABORACIONES", "tipo" => 0 ],
            ["indice" => 6, "nombre"=> "Caja Chica: GASOLINA", "tipo" => 0 ],
            ["indice" => 7, "nombre"=> "Caja Chica: LIMPIEZA", "tipo" => 0 ],
            ["indice" => 8, "nombre"=> "Caja Chica: PAPELERIA", "tipo" => 0 ],
            ["indice" => 9, "nombre"=> "Caja Chica: REPARACIONES Y MANTENIMIENTO", "tipo" => 0 ],
            ["indice" => 10, "nombre"=> "Caja Chica EFECTIVO ADICIONAL", "tipo" => 0 ],
            ["indice" => 11, "nombre"=> "Caja Fuerte EFECTIVO ADICIONAL", "tipo" => 1 ],
            
            ["indice" => 12, "nombre"=> "Caja Fuerte AGUA Y ELECTRICIDAD", "tipo" => 1 ],
            ["indice" => 13, "nombre"=> "Caja Fuerte ALQUILER", "tipo" => 1 ],
            ["indice" => 14, "nombre"=> "Caja Fuerte INTERNET", "tipo" => 1 ],
            ["indice" => 15, "nombre"=> "Caja Fuerte NOMINA", "tipo" => 1 ],
            ["indice" => 16, "nombre"=> "Caja Fuerte OMAR AMER YESER YEISER RAID", "tipo" => 1 ],
            ["indice" => 17, "nombre"=> "Caja Fuerte: PAGO PROVEEDOR", "tipo" => 1 ],
            
            ["indice" => 18, "nombre"=> "Caja Chica: REPARACION DE VEHICULOS", "tipo" => 0 ],
            ["indice" => 19, "nombre"=> "Caja Chica: CALETEROS", "tipo" => 0 ],
            ["indice" => 20, "nombre"=> "Caja Chica: TRANSFERENCIA ENTRE TRABAJADORES", "tipo" => 0 ],
            ["indice" => 21, "nombre"=> "Caja Chica: TRANSPORTE DE PERSONAL", "tipo" => 0 ],
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
