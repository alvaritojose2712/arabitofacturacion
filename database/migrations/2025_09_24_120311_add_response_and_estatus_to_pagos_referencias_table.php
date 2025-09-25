<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddResponseAndEstatusToPagosReferenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pagos_referencias', function (Blueprint $table) {
            $table->json('response')->nullable();
            $table->string('estatus')->nullable();
            
            $table->string('banco')->nullable()->change();
            $table->string('descripcion')->nullable()->change();
            $table->decimal('monto',15,4)->nullable()->change();
            
            $table->string('cedula')->nullable();
            $table->string('telefono')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pagos_referencias', function (Blueprint $table) {
            $table->dropColumn(['response', 'estatus']);
        });
    }
}
