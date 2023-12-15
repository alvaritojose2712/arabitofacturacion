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
            
            ["indice"=>"1", "nombre"=>"INGRESO DESDE CIERRE",  "tipo"=>"0"],
            ["indice"=>"2", "nombre"=>"INGRESO DESDE CIERRE",  "tipo"=>"1"],
            ["indice"=>"3", "nombre"=>"CAJA CHICA: CAFE, AZUCAR, PANELADA",    "tipo"=>"0"],
            ["indice"=>"4", "nombre"=>"CAJA CHICA: CENAS: TRABAJO NOCTURNO",   "tipo"=>"0"],
            ["indice"=>"5", "nombre"=>"CAJA CHICA: COLABORACIONES",    "tipo"=>"0"],
            ["indice"=>"6", "nombre"=>"CAJA FUERTE: DISTRIBUCION: GASOLINA",   "tipo"=>"1"],
            ["indice"=>"7", "nombre"=>"CAJA CHICA: LIMPIEZA",  "tipo"=>"0"],
            ["indice"=>"8", "nombre"=>"CAJA CHICA: PAPELERIA", "tipo"=>"0"],
            ["indice"=>"9", "nombre"=>"CAJA CHICA: REPARACIONES Y MANTENIMIENTO DE SUCURSAL",  "tipo"=>"0"],
            ["indice"=>"10",    "nombre"=>"CAJA CHICA: EFECTIVO ADICIONAL",   "tipo"=>"0"],
            ["indice"=>"11",    "nombre"=>"CAJA FUERTE: EFECTIVO ADICIONAL",  "tipo"=>"1"],
            ["indice"=>"12",    "nombre"=>"CAJA FUERTE: AGUA Y ELECTRICIDAD", "tipo"=>"1"],
            ["indice"=>"13",    "nombre"=>"CAJA FUERTE: ALQUILER",    "tipo"=>"1"],
            ["indice"=>"14",    "nombre"=>"CAJA FUERTE: INTERNET",    "tipo"=>"1"],
            ["indice"=>"15",    "nombre"=>"CAJA FUERTE: NOMINA",  "tipo"=>"1"],
            ["indice"=>"16",    "nombre"=>"CAJA FUERTE: FDI", "tipo"=>"1"],
            ["indice"=>"17",    "nombre"=>"CAJA FUERTE: PAGO PROVEEDOR",  "tipo"=>"1"],
            ["indice"=>"18",    "nombre"=>"CAJA CHICA: REPARACION DE VEHICULOS",  "tipo"=>"0"],
            ["indice"=>"19",    "nombre"=>"CAJA CHICA: CALETEROS",    "tipo"=>"0"],
            ["indice"=>"20",    "nombre"=>"CAJA CHICA: TRANSFERENCIA DE TRABAJADORES",    "tipo"=>"0"],
            ["indice"=>"21",    "nombre"=>"CAJA CHICA: TRANSPORTE DE PERSONAL",   "tipo"=>"0"],
            ["indice"=>"22",    "nombre"=>"CAJA FUERTE: DISTRIBUCION: GASOIL",    "tipo"=>"1"],
            ["indice"=>"23",    "nombre"=>"CAJA FUERTE: DISTRIBUCION: VIATICO Y PEAJE",   "tipo"=>"1"],
            ["indice"=>"24",    "nombre"=>"CAJA CHICA: SUMINISTROS CASA IMPORTADOS",  "tipo"=>"0"],
            ["indice"=>"25",    "nombre"=>"DIRECCION GENERAL: OMAR",  "tipo"=>"2"],
            ["indice"=>"26",    "nombre"=>"DIRECCION GENERAL:  AMER", "tipo"=>"2"],
            ["indice"=>"27",    "nombre"=>"FINANZAS: RAID",   "tipo"=>"2"],
            ["indice"=>"28",    "nombre"=>"OPERACIONES: YESER",   "tipo"=>"2"],
            ["indice"=>"29",    "nombre"=>"OPERACIONES: YEISER",  "tipo"=>"2"],
            ["indice"=>"30",    "nombre"=>"GERENTE DE SUCURSAL",  "tipo"=>"2"],
            ["indice"=>"31",    "nombre"=>"elorza",   "tipo"=>"3"],
            ["indice"=>"32",    "nombre"=>"mantecal", "tipo"=>"3"],
            ["indice"=>"33",    "nombre"=>"achaguas", "tipo"=>"3"],
            ["indice"=>"34",    "nombre"=>"elsaman",  "tipo"=>"3"],
            ["indice"=>"35",    "nombre"=>"bruzual",  "tipo"=>"3"],
            ["indice"=>"36",    "nombre"=>"sanfernando1", "tipo"=>"3"],
            ["indice"=>"37",    "nombre"=>"sanfernando2", "tipo"=>"3"],
            ["indice"=>"38",    "nombre"=>"calabozo", "tipo"=>"3"],
            ["indice"=>"39",    "nombre"=>"valledelapascua",  "tipo"=>"3"],
            ["indice"=>"40",    "nombre"=>"valledelapascua2", "tipo"=>"3"],
            ["indice"=>"41",    "nombre"=>"sanjuandelosmorros",   "tipo"=>"3"],
            ["indice"=>"42",    "nombre"=>"maracay",  "tipo"=>"3"],
            ["indice"=>"43",    "nombre"=>"SUCURSAL ACTUAL",  "tipo"=>"3"],
            ["indice"=>"44",    "nombre"=>"TODAS SUCURSALES", "tipo"=>"3"],
            ["indice"=>"45",    "nombre"=>"TRASPASO A CAJA MATRIZ", "tipo"=>"1"],
            
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
