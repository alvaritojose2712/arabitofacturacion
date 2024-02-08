<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class CreateUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
            $table->string('usuario')->unique();
            $table->string('clave');
            $table->integer('tipo_usuario');
            //1 Administrador
            //2 Caja
            //3 Vendedor
            //4 Cajero Vendedor
            $table->timestamps();
        });
         DB::table("usuarios")->insert([
            [
            "nombre" => "Alvaro Ospino",
            "usuario" => "admin",
            "clave" => Hash::make("1234"),
            "tipo_usuario" => "1",
            ],

            [
            "nombre" => "Perez",
            "usuario" => "caja",
            "clave" => Hash::make("1234"),
            "tipo_usuario" => "2",
            ],

            [
            "nombre" => "Rodiguez",
            "usuario" => "vendedor",
            "clave" => Hash::make("1234"),
            "tipo_usuario" => "3",
            ],

            [
            "nombre" => "Alfonzo",
            "usuario" => "cajero_vendedor",
            "clave" => Hash::make("1234"),
            "tipo_usuario" => "4",
            ],
        ]); 
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
}
