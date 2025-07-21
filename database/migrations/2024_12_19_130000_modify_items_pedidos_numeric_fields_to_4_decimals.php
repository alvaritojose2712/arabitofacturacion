<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items_pedidos', function (Blueprint $table) {
            // Modificar campos numéricos a 4 decimales para mayor precisión
            $table->decimal('cantidad', 18, 4)->change();
            $table->decimal('descuento', 10, 4)->change();
            $table->decimal('monto', 18, 4)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items_pedidos', function (Blueprint $table) {
            // Revertir cambios a los valores originales
            $table->decimal('cantidad', 10, 2)->change();
            $table->decimal('descuento', 6, 2)->change();
            $table->decimal('monto', 10, 2)->change();
        });
    }
}; 