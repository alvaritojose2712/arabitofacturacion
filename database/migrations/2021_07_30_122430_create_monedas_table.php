<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonedasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('monedas', function (Blueprint $table) {
            $table->increments('id');
            $table->enum("tipo",[1,2]);
            $table->decimal("valor",10,2);
            $table->timestamps();
        });
        /* DB::table("monedas")->insert([
            ["tipo"=>1,"valor"=>"26"],
            ["tipo"=>2,"valor"=>"4500"],
        ]); */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('monedas');
    }
}
