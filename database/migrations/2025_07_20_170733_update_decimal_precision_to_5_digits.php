<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDecimalPrecisionTo5Digits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Actualizar campos de precios y montos en tablas principales
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos', 'precio')) {
                $table->decimal('precio', 15, 5)->change();
            }
            if (Schema::hasColumn('productos', 'precio_alterno')) {
                $table->decimal('precio_alterno', 15, 5)->change();
            }
        });

        Schema::table('pedidos', function (Blueprint $table) {
            if (Schema::hasColumn('pedidos', 'total')) {
                $table->decimal('total', 15, 5)->change();
            }
            if (Schema::hasColumn('pedidos', 'monto_pagado')) {
                $table->decimal('monto_pagado', 15, 5)->change();
            }
        });

        Schema::table('pagos_pedidos', function (Blueprint $table) {
            if (Schema::hasColumn('pagos_pedidos', 'monto')) {
                $table->decimal('monto', 15, 5)->change();
            }
        });

        Schema::table('inventario', function (Blueprint $table) {
            if (Schema::hasColumn('inventario', 'precio_compra')) {
                $table->decimal('precio_compra', 15, 5)->change();
            }
            if (Schema::hasColumn('inventario', 'precio_venta')) {
                $table->decimal('precio_venta', 15, 5)->change();
            }
        });

        Schema::table('cierres_puntos', function (Blueprint $table) {
            if (Schema::hasColumn('cierres_puntos', 'monto_efectivo')) {
                $table->decimal('monto_efectivo', 15, 5)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_debito')) {
                $table->decimal('monto_debito', 15, 5)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_transferencia')) {
                $table->decimal('monto_transferencia', 15, 5)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_biopago')) {
                $table->decimal('monto_biopago', 15, 5)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'total')) {
                $table->decimal('total', 15, 5)->change();
            }
        });

        Schema::table('cajas', function (Blueprint $table) {
            if (Schema::hasColumn('cajas', 'monto_inicial')) {
                $table->decimal('monto_inicial', 15, 5)->change();
            }
            if (Schema::hasColumn('cajas', 'monto_actual')) {
                $table->decimal('monto_actual', 15, 5)->change();
            }
        });

        Schema::table('movimientos_caja', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_caja', 'monto')) {
                $table->decimal('monto', 15, 5)->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revertir cambios
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos', 'precio')) {
                $table->decimal('precio', 10, 2)->change();
            }
            if (Schema::hasColumn('productos', 'precio_alterno')) {
                $table->decimal('precio_alterno', 10, 2)->change();
            }
        });

        Schema::table('pedidos', function (Blueprint $table) {
            if (Schema::hasColumn('pedidos', 'total')) {
                $table->decimal('total', 10, 2)->change();
            }
            if (Schema::hasColumn('pedidos', 'monto_pagado')) {
                $table->decimal('monto_pagado', 10, 2)->change();
            }
        });

        Schema::table('pagos_pedidos', function (Blueprint $table) {
            if (Schema::hasColumn('pagos_pedidos', 'monto')) {
                $table->decimal('monto', 10, 2)->change();
            }
        });

        Schema::table('inventario', function (Blueprint $table) {
            if (Schema::hasColumn('inventario', 'precio_compra')) {
                $table->decimal('precio_compra', 10, 2)->change();
            }
            if (Schema::hasColumn('inventario', 'precio_venta')) {
                $table->decimal('precio_venta', 10, 2)->change();
            }
        });

        Schema::table('cierres_puntos', function (Blueprint $table) {
            if (Schema::hasColumn('cierres_puntos', 'monto_efectivo')) {
                $table->decimal('monto_efectivo', 10, 2)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_debito')) {
                $table->decimal('monto_debito', 10, 2)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_transferencia')) {
                $table->decimal('monto_transferencia', 10, 2)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'monto_biopago')) {
                $table->decimal('monto_biopago', 10, 2)->change();
            }
            if (Schema::hasColumn('cierres_puntos', 'total')) {
                $table->decimal('total', 10, 2)->change();
            }
        });

        Schema::table('cajas', function (Blueprint $table) {
            if (Schema::hasColumn('cajas', 'monto_inicial')) {
                $table->decimal('monto_inicial', 10, 2)->change();
            }
            if (Schema::hasColumn('cajas', 'monto_actual')) {
                $table->decimal('monto_actual', 10, 2)->change();
            }
        });

        Schema::table('movimientos_caja', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_caja', 'monto')) {
                $table->decimal('monto', 10, 2)->change();
            }
        });
    }
}
