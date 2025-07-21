<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExtendMonedasTableAddNewFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('monedas', function (Blueprint $table) {
            // Agregar nuevos campos
            $table->timestamp('fecha_ultima_actualizacion')->nullable()->after('valor');
            $table->string('origen', 100)->nullable()->after('fecha_ultima_actualizacion');
            $table->text('notas')->nullable()->after('origen');
            $table->enum('estatus', ['activo', 'inactivo'])->default('activo')->after('notas');
            
            // Modificar la precisión decimal del campo valor para soportar 5 decimales
            // Máximo: 9.999.999.999,12345
            $table->decimal('valor', 15, 5)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('monedas', function (Blueprint $table) {
            // Revertir cambios
            $table->dropColumn(['fecha_ultima_actualizacion', 'origen', 'notas', 'estatus']);
            
            // Revertir la precisión decimal
            $table->decimal('valor', 10, 2)->change();
        });
    }
}
