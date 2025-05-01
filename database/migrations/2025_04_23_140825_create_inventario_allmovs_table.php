<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventarioAllmovsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventario_allmovs', function (Blueprint $table) {
            $table->increments("id");
            
            $table->decimal("ct",15,3);
            $table->integer("id_producto");
            $table->string("type");
            
            $table->integer("id_usuario")->nullable();
            
            $table->timestamps();
            $table->unique(["id_producto","created_at"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventario_allmovs');
    }
}
