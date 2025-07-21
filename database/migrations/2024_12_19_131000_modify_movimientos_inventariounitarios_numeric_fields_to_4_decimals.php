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
        Schema::table('movimientos_inventariounitarios', function (Blueprint $table) {
            // Modificar campos numéricos a decimal(15,4) para mayor precisión
            $table->decimal('cantidad', 15, 4)->change();
            $table->decimal('cantidadafter', 15, 4)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventariounitarios', function (Blueprint $table) {
            // Revertir cambios a decimal(15,3)
            $table->decimal('cantidad', 15, 3)->change();
            $table->decimal('cantidadafter', 15, 3)->change();
        });
    }
}; 