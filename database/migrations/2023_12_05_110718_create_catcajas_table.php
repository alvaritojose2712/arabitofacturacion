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
            $table->string("nombre");
            $table->integer("tipo");
            $table->integer("catgeneral")->nullable(true);
            $table->integer("ingreso_egreso")->nullable(true);
            $table->timestamps();

            
        });

       /*  DB::table("catcajas")->insert([
            ["indice"=>"20",	"nombre"=>"CAJA FUERTE: PAGO PROVEEDOR",	"tipo"=>"1",	"catgeneral"=>"0"],
            ["indice"=>"1",	"nombre"=>"CAJA CHICA: EFECTIVO ADICIONAL",	"tipo"=>"0",	"catgeneral"=>"1"],
            ["indice"=>"10",	"nombre"=>"INGRESO DESDE CIERRE",	"tipo"=>"1",	"catgeneral"=>"1"],
            ["indice"=>"11",	"nombre"=>"CAJA FUERTE: EFECTIVO ADICIONAL",	"tipo"=>"1",	"catgeneral"=>"1"],
            ["indice"=>"2",	"nombre"=>"CAJA CHICA: BENEFICIOS PERSONAL, CENAS, PASEOS, REGALOS, TRABAJO NOCTURNO, TRANSPORTE, ETC (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"3",	"nombre"=>"CAJA CHICA: CALETEROS (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"4",	"nombre"=>"CAJA CHICA: COLABORACION SUCURSAL (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"5",	"nombre"=>"CAJA CHICA: REPARACIONES Y MANTENIMIENTO DE SUCURSAL: PAPELERIA, LIMPIEZA, CAFE, AZUCAR, PANELADA, AGUA (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"6",	"nombre"=>"CAJA CHICA: TRANSPORTE: COMBUSTIBLE (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"7",	"nombre"=>"CAJA CHICA: TRANSPORTE: REPARACION DE VEHICULOS (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"8",	"nombre"=>"CAJA CHICA: SUMINISTROS CASA IMPORTADOS (SOLO SUCURSAL)",	"tipo"=>"0",	"catgeneral"=>"2"],
            ["indice"=>"12",	"nombre"=>"CAJA FUERTE: ALQUILER (SOLO SUCURSAL)",	"tipo"=>"1",	"catgeneral"=>"2"],
            ["indice"=>"13",	"nombre"=>"CAJA FUERTE: NOMINA (SOLO SUCURSAL)",	"tipo"=>"1",	"catgeneral"=>"2"],
            ["indice"=>"14",	"nombre"=>"CAJA FUERTE: SERVICIOS: AGUA, ELECTRICIDAD, INTERNET (SOLO SUCURSAL)",	"tipo"=>"1",	"catgeneral"=>"2"],
            ["indice"=>"15",	"nombre"=>"CAJA FUERTE: COLABORACIONES GENERAL (TODAS SUCURSALES)",	"tipo"=>"1",	"catgeneral"=>"3"],
            ["indice"=>"16",	"nombre"=>"CAJA FUERTE: TALONARIOS, SELLOS, ETC (TODAS SUCURSALES)",	"tipo"=>"1",	"catgeneral"=>"3"],
            ["indice"=>"17",	"nombre"=>"CAJA FUERTE: TRANSPORTE: COMBUSTIBLE (TODAS SUCURSALES)",	"tipo"=>"1",	"catgeneral"=>"3"],
            ["indice"=>"18",	"nombre"=>"CAJA FUERTE: TRANSPORTE: REPARACION DE VEHICULOS (TODAS SUCURSALES)",	"tipo"=>"1",	"catgeneral"=>"3"],
            ["indice"=>"19",	"nombre"=>"CAJA FUERTE: TRANSPORTE: VIATICOS Y PEAJES (TODAS SUCURSALES)",	"tipo"=>"1",	"catgeneral"=>"3"],
            ["indice"=>"21",	"nombre"=>"CAJA FUERTE: FDI",	"tipo"=>"1",	"catgeneral"=>"4"],
            ["indice"=>"23",	"nombre"=>"CAJA FUERTE: TRANSFERENCIA DE TRABAJADORES",	"tipo"=>"1",	"catgeneral"=>"4"],
            ["indice"=>"9",	"nombre"=>"CAJA CHICA: TRASPASO A CAJA FUERTE",	"tipo"=>"0",	"catgeneral"=>"5"],
            ["indice"=>"24",	"nombre"=>"CAJA FUERTE: TRASPASO A CAJA CHICA",	"tipo"=>"1",	"catgeneral"=>"5"],
            ["indice"=>"22",	"nombre"=>"CAJA FUERTE: TRASPASO A CAJA MATRIZ (RAID RETIRA)",	"tipo"=>"1",	"catgeneral"=>"6"],
            ["indice"=>"25",	"nombre"=>"GERENTE DE SUCURSAL",	"tipo"=>"2",	"catgeneral"=>null],
            ["indice"=>"26",	"nombre"=>"ADMINISTRACION: RAID",	"tipo"=>"2",	"catgeneral"=>null],
            ["indice"=>"27",	"nombre"=>"SUCURSAL ACTUAL",	"tipo"=>"3",	"catgeneral"=>null],
            ["indice"=>"28",	"nombre"=>"TODAS SUCURSALES",	"tipo"=>"3",	"catgeneral"=>null],
            
        ]); */

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
