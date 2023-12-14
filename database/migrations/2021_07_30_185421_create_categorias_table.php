<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion');

            $table->timestamps();
        });
         /* DB::table("categorias")->insert([
            ["descripcion"=>"AGRICOLA"],
            ["descripcion"=>"ALAMBRE"],
            ["descripcion"=>"BATERIA"],
            ["descripcion"=>"CONSTRUCCION"],
            ["descripcion"=>"COSMETICOS"],
            ["descripcion"=>"CUIDADO DEL HOGAR"],
            ["descripcion"=>"DISCO"],
            ["descripcion"=>"ELECTRICIDAD"],
            ["descripcion"=>"ELECTRODOMESTICO"],
            ["descripcion"=>"ELECTRONICA"],
            ["descripcion"=>"FONTANERIA"],
            ["descripcion"=>"GAS"],
            ["descripcion"=>"GRIFERIA"],
            ["descripcion"=>"HERRAMIENTAS"],
            ["descripcion"=>"HERRERIA"],
            ["descripcion"=>"INTERNET"],
            ["descripcion"=>"MECANICA"],
            ["descripcion"=>"MOTOS"],
            ["descripcion"=>"NAILOS"],
            ["descripcion"=>"PEGAS"],
            ["descripcion"=>"PINTURA"],
            ["descripcion"=>"PLOMERIA"],
            ["descripcion"=>"REFRIGERACION"],
            ["descripcion"=>"REPUESTOS"],
            ["descripcion"=>"TECNOLOGIA"],
            ["descripcion"=>"TELEFONIA"],
            ["descripcion"=>"TERMOS"],
            ["descripcion"=>"TORNILLERIA"],
            ["descripcion"=>"VETERINARIA"],

        ]); */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categorias');
    }
}
