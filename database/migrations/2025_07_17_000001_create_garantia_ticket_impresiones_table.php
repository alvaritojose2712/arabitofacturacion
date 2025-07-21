<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGarantiaTicketImpresionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('garantia_ticket_impresiones', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('solicitud_garantia_id');
            $table->unsignedInteger('usuario_id')->nullable();
            $table->string('tipo_impresion'); // 'ORIGINAL' o 'COPIA'
            $table->integer('numero_impresion'); // 1 para original, 2,3,4... para copias
            $table->json('datos_impresion')->nullable(); // Datos completos que se imprimieron
            $table->timestamp('fecha_impresion');
            $table->string('ip_impresion')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index('solicitud_garantia_id');
            $table->index('tipo_impresion');
            $table->index('fecha_impresion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('garantia_ticket_impresiones');
    }
} 