<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSucursalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursals', function (Blueprint $table) {
            $table->increments("id");

            $table->string("sucursal");
            $table->string("codigo")->unique();
            $table->string("direccion_registro");
            $table->string("direccion_sucursal");
            $table->string("telefono1");
            $table->string("telefono2");

            $table->string("correo");
            $table->string("nombre_registro");
            $table->string("rif");
            $table->boolean("iscentral")->default(0);


            $table->string("tickera")->nullable();
            $table->string("fiscal")->nullable();
            $table->string("app_version")->default("1");
            
// SUCURSAL="Mantecal"
// CODIGO="ARAMCAL"
// DIRECCION_REGISTRO="Av. Bolívar Cruce con Indio Figueredo, Casa Nro. S/N Sector Centro Elorza, Estado Aure Zona Postal 7011"
// DIRECCION_SUCURSAL="Av. Libertador Local S/N Sector centro, Parroquia Mantecal Municipio Muñoz, Estado Apure Zona postal 7011"

            $table->timestamps();
        });

       /*  DB::table("sucursals")->insert([
            [
                "sucursal" => "aaa",
                "codigo" => "ARAMCAL",
                "direccion_registro" => "aaa",
                "direccion_sucursal" => "aaa",
                "telefono1" => "aaa",
                "telefono2" => "aaa",
                "correo" => "aaa",
                "nombre_registro" => "aaa",
                "rif" => "aaa",
            ],
        ]); */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursals');
    }
}
