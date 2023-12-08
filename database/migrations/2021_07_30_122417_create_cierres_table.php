<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCierresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cierres', function (Blueprint $table) {
            $table->increments('id');
            
            $table->decimal("debito",10,2); 
            $table->decimal("efectivo",10,2); 
            $table->decimal("transferencia",10,2); 
            
            $table->decimal("dejar_dolar",10,2); 
            $table->decimal("dejar_peso",10,2); 
            $table->decimal("dejar_bss",10,2);
            
            
            $table->decimal("efectivo_guardado",10,2);
            $table->decimal("efectivo_guardado_cop",10,2);
            $table->decimal("efectivo_guardado_bs",10,2);
            
            $table->decimal("efectivo_actual",10,2)->default(0);
            $table->decimal("efectivo_actual_cop",10,2)->default(0);
            $table->decimal("efectivo_actual_bs",10,2)->default(0);
            $table->decimal("caja_biopago",10,2)->default(0);
            

            $table->decimal("puntodeventa_actual_bs",10,2)->default(0);

            $table->string("puntolote1")->nullable(true)->default(null);
            $table->decimal("puntolote1montobs",10,2)->nullable(true)->default(0);
            $table->string("puntolote1banco")->nullable(true)->default(0);

            $table->string("puntolote2")->nullable(true)->default(null);
            $table->decimal("puntolote2montobs",10,2)->nullable(true)->default(0);
            $table->string("puntolote2banco")->nullable(true)->default(0);

            $table->string("biopagoserial")->nullable(true)->default(null);
            $table->decimal("biopagoserialmontobs",10,2)->nullable(true)->default(0);


            $table->decimal("tasa",10,2); 
            
            $table->text("nota")->nullable();
            
            $table->date("fecha");
            
            $table->integer("id_usuario")->unsigned();
            $table->foreign('id_usuario')->references('id')->on('usuarios');
            
            
            
            $table->integer("numventas")->default(0); 
            
            $table->decimal("precio",10,2)->default(0);
            $table->decimal("precio_base",10,2)->default(0);
            $table->decimal("ganancia",10,2)->default(0);
            $table->decimal("porcentaje",10,2)->default(0);
            $table->decimal("desc_total",10,2)->default(0);
            
            $table->boolean("tipo_cierre")->default(0);
            //0 cajero
            //1 admin
            
            $table->unique(["fecha","id_usuario","tipo_cierre"]);
            
            $table->boolean("push")->default(0);
            
            $table->decimal("tasacop",10,2)->default(0); 
            $table->decimal("inventariobase",10,2)->default(0);
            $table->decimal("inventarioventa",10,2)->default(0);
            
            $table->string("numreportez")->nullable();
            $table->decimal("ventaexcento",10,2)->default(0);
            $table->decimal("ventagravadas",10,2)->default(0);
            $table->decimal("ivaventa",10,2)->default(0);
            $table->decimal("totalventa",10,2)->default(0);
            $table->string("ultimafactura")->nullable();
            
            $table->decimal("credito",10,2)->default(0);
            $table->decimal("creditoporcobrartotal",10,2)->default(0);
            $table->decimal("vueltostotales",10,2)->default(0);
            $table->decimal("abonosdeldia",10,2)->default(0);
            
            $table->decimal("efecadiccajafbs",10,2)->default(0);
            $table->decimal("efecadiccajafcop",10,2)->default(0);
            $table->decimal("efecadiccajafdolar",10,2)->default(0);
            $table->decimal("efecadiccajafeuro",10,2)->default(0);


            
            $table->timestamps();


        });

        DB::table("cierres")->insert([
            [
                "debito" =>0,
                "efectivo" =>0,
                "transferencia" =>0,
                "dejar_dolar" =>0,
                "dejar_peso" =>0,
                "dejar_bss" =>0,
                "efectivo_guardado" =>0,
                "efectivo_guardado_cop" =>0,
                "efectivo_guardado_bs" =>0,
                "efectivo_actual" =>0,
                "efectivo_actual_cop" =>0,
                "efectivo_actual_bs" =>0,
                "puntodeventa_actual_bs" =>0,
                "tasa" =>0,
                "nota" =>0,
                "fecha" =>"2023-01-01",
                "id_usuario" =>1,
                "numventas" =>0,
                "precio" =>0,
                "precio_base" =>0,
                "ganancia" =>0,
                "porcentaje" =>0,
                "desc_total" =>0,
                "push" =>0,
                "caja_biopago" =>0,
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
        Schema::dropIfExists('cierres');
    }
}
