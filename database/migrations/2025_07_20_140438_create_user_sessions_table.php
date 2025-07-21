<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('usuario_id');
            $table->string('session_id')->unique();
            $table->string('ip_address');
            $table->string('user_agent');
            $table->timestamp('last_activity');
            $table->boolean('is_active')->default(true);
            $table->json('legacy_session_data')->nullable(); // Para compatibilidad con sesiones actuales
            $table->timestamps();
            
            // Clave foránea con el tipo correcto
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            
            // Índices para optimizar consultas
            $table->index(['usuario_id', 'is_active']);
            $table->index(['session_id', 'is_active']);
            $table->index('last_activity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_sessions');
    }
};
