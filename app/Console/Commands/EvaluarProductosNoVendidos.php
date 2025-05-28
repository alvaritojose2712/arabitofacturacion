<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\inventario; // Asegúrate de que este sea tu modelo para la tabla 'inventarios'
// Si tu modelo para items_pedidos se llama diferente o está en otro namespace, ajústalo:
// use App\Models\ItemPedido; 
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Para manipulación de fechas
use Illuminate\Database\Eloquent\Builder;

class EvaluarProductosNoVendidos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'productos:evaluar-no-vendidos 
    {--S|semanas=6 : Número de semanas sin ventas para considerar un producto obsoleto (Criterio 1).}
    {--D|dry-run : Ejecutar el comando sin eliminar productos, solo mostrarlos.}
    {--E|eliminar : Ejecutar el comando y eliminar los productos que cumplen los criterios (USAR CON PRECAUCIÓN).}';

   
    protected $description = 'Evalúa y opcionalmente elimina productos que: 1) Tienen cantidad 0 y sin ventas recientes (por defecto, 6 meses). O 2) Tienen cantidad 0 y precio 0.';

 
    public function __construct()
    {
        parent::__construct();
    }

  
    public function handle()
    {
        // -------------------------------------------------------------------------
        // NOTAS IMPORTANTES ANTES DE EJECUTAR EN PRODUCCIÓN:
        // 1. Modelos y Relaciones:
        //    - Asegúrate de que el modelo `App\Models\Inventario` exista y corresponda
        //      a tu tabla de inventarios.
        //    - Verifica que el modelo `Inventario` tenga la relación `items()`
        //      definida correctamente, apuntando a tu modelo de items/líneas de pedido
        //      (ej. `App\Models\ItemPedido`) y usando las claves foráneas correctas.
        //      Ejemplo en el modelo Inventario:
        //      public function items() {
        //          return $this->hasMany(ItemPedido::class, 'id_producto', 'id'); // Ajusta 'ItemPedido::class', 'id_producto' e 'id' según tu estructura
        //      }
        // 2. Campos Requeridos en `Inventario`:
        //    - `cantidad` (numérico)
        //    - `precio` (numérico, para Criterio 2) - ¡Ajusta el nombre del campo si es diferente!
        //    - `push` (numérico/booleano, para Criterio 3) - ¡Ajusta el nombre del campo si es diferente!
        //    - `descripcion` (o el campo que uses para identificar el producto en los logs)
        // 3. Índices de Base de Datos (CRUCIAL para el rendimiento):
        //    - `inventarios(cantidad)`
        //    - `inventarios(precio)` (o tu campo de precio)
        //    - `inventarios(push)` (o tu campo de push)
        //    - `items_pedidos(id_producto)`
        //    - `items_pedidos(created_at)`
        //    - Idealmente, un índice compuesto: `items_pedidos(id_producto, created_at)`
        // 4. Backup: ¡SIEMPRE haz un backup de tu base de datos antes de ejecutar con `--eliminar` en producción!
        // -------------------------------------------------------------------------

        $semanasSinVentas = (int) $this->option('semanas');
        if ($semanasSinVentas <= 0) {
            $this->error('El número de semanas debe ser un entero positivo.');
            return Command::FAILURE;
        }

        $dryRun = $this->option('dry-run');
        $eliminar = $this->option('eliminar');

        if ($eliminar && $dryRun) {
            $this->error('No puedes usar --dry-run y --eliminar al mismo tiempo.');
            return Command::FAILURE;
        }
        
        $confirmMessage = "¿Estás SEGURO de que quieres ELIMINAR los productos que cumplen con CUALQUIERA de estos criterios?:\n";
        $confirmMessage .= "1. Cantidad = 0 Y sin ventas en {$semanasSinVentas} semanas.\n";
        $confirmMessage .= "2. Cantidad = 0 Y Precio = 0.\n";
        $confirmMessage .= "3. Cantidad = 0 Y Push = 0.\n"; // Nuevo criterio en confirmación
        $confirmMessage .= "Esta acción es IRREVERSIBLE.";


        if ($eliminar && !$this->confirm($confirmMessage)) {
            $this->info('Operación de eliminación cancelada por el usuario.');
            return Command::SUCCESS;
        }

        $this->info("Iniciando evaluación de productos...");
        $this->line("Criterio 1: Cantidad = 0 Y sin ventas en las últimas {$semanasSinVentas} semanas.");
        $this->line("Criterio 2: Cantidad = 0 Y Precio = 0.");
        $this->line("Criterio 3: Cantidad = 0 Y Push = 0."); // Nuevo criterio en log


        // Fecha límite para la última venta (Criterio 1)
        $fechaLimite = Carbon::now()->subWeeks($semanasSinVentas);

        // IDs de productos que cumplen al menos una condición
        $idsProductosParaProcesar = collect();

        // Obtener IDs para Criterio 1: Cantidad 0 y sin ventas recientes
        $this->info("Buscando productos para Criterio 1...");
        $idsCriterio1 = Inventario::where('cantidad', 0)
            ->whereDoesntHave('items_pedidos', function (Builder $query) use ($fechaLimite) {
                $query->where('created_at', '>=', $fechaLimite);
            })
            ->pluck('id');
        
        $idsProductosParaProcesar = $idsProductosParaProcesar->merge($idsCriterio1);
        $this->info(count($idsCriterio1) . " productos encontrados para el Criterio 1.");

        // Obtener IDs para Criterio 2: Cantidad 0 y Precio 0
        // Asegúrate de que tu modelo Inventario tenga un campo 'precio' o ajústalo.
        $this->info("Buscando productos para Criterio 2...");
        $idsCriterio2 = Inventario::where('cantidad', 0)
            ->where('precio', 0) // Asume que tienes un campo 'precio' en tu tabla 'inventarios'. ¡AJUSTA SI ES DIFERENTE!
            ->pluck('id');
        
        $idsProductosParaProcesar = $idsProductosParaProcesar->merge($idsCriterio2);
        $this->info(count($idsCriterio2) . " productos encontrados para el Criterio 2.");

        // Obtener IDs para Criterio 3: Cantidad 0 y Push 0
        // Asegúrate de que tu modelo Inventario tenga un campo 'push' o ajústalo.
        $this->info("Buscando productos para Criterio 3...");
        $idsCriterio3 = Inventario::where('cantidad', 0)
            ->where('push', 0) // Asume que tienes un campo 'push' en tu tabla 'inventarios'. ¡AJUSTA SI ES DIFERENTE!
            ->pluck('id');

        $idsProductosParaProcesar = $idsProductosParaProcesar->merge($idsCriterio3);
        $this->info(count($idsCriterio3) . " productos encontrados para el Criterio 3.");


        // Unificar IDs para no procesar dos veces
        $idsUnicosParaProcesar = $idsProductosParaProcesar->unique()->values();
        
        $contadorProductosEncontrados = 0;
        $idsProductosEliminarDefinitivo = [];

        $controller = new \App\Http\Controllers\sendCentral();
        if ($idsUnicosParaProcesar->isEmpty()) {
            $this->info("No se encontraron productos que cumplan con ninguno de los criterios establecidos.");
            $this->info('PROCESANDO SINCRONIZACION DE INVENTARIO');
            $controller->getAllInventarioFromCentral()->then(function() use ($controller) {
                $this->info('PROCESANDO SEND ALL TEST');
                $controller->sendAllTest();
            });

            return Command::SUCCESS;
        }
        
        $this->info("Procesando " . $idsUnicosParaProcesar->count() . " productos únicos que cumplen al menos un criterio.");
        $this->getOutput()->progressStart($idsUnicosParaProcesar->count()); // Barra de progreso

        // Procesar en chunks para no agotar la memoria
        foreach (array_chunk($idsUnicosParaProcesar->all(), 200) as $chunkDeIds) {
            // Es importante obtener los productos con todos los campos necesarios para la lógica y el log
            $productos = Inventario::whereIn('id', $chunkDeIds)->get(['id', 'descripcion', 'cantidad', 'precio', 'push']); // Especifica columnas

            foreach ($productos as $producto) {
                $contadorProductosEncontrados++;
                $this->line(""); // Espacio antes de cada producto
                $this->info("Evaluando Producto ID: <options=bold>{$producto->id}</> | Descripción: <options=bold>{$producto->descripcion}</> | Cantidad: {$producto->cantidad} | Precio: {$producto->precio} | Push: {$producto->push}");

                // Determinar y mostrar qué criterios cumple
                $cumpleCriterio1 = $idsCriterio1->contains($producto->id);
                $cumpleCriterio2 = $idsCriterio2->contains($producto->id);
                $cumpleCriterio3 = $idsCriterio3->contains($producto->id);

                $criteriosCumplidosMsgs = [];
                if ($cumpleCriterio1) {
                     $criteriosCumplidosMsgs[] = "C1: Cant.0 & sin ventas {$semanasSinVentas} sem.";
                }
                if ($cumpleCriterio2) {
                     $criteriosCumplidosMsgs[] = "C2: Cant.0 & Precio 0";
                }
                if ($cumpleCriterio3) {
                     $criteriosCumplidosMsgs[] = "C3: Cant.0 & Push 0";
                }
                $this->comment("-> Cumple: " . implode(', ', $criteriosCumplidosMsgs));


                if ($eliminar) {
                    $idsProductosEliminarDefinitivo[] = $producto->id;
                    $this->warn("MARCADO PARA ELIMINAR: Producto ID {$producto->id}");
                } elseif ($dryRun) {
                    $this->comment("(Dry run) Producto ID {$producto->id} sería eliminado.");
                } else {
                    // Si no es dry-run ni eliminar, solo se muestra.
                }
                $this->getOutput()->progressAdvance();
            }
        }
        $this->getOutput()->progressFinish();
        
        $this->line("==================================================");

        if ($contadorProductosEncontrados > 0) {
            // El mensaje de "Se evaluaron..." ya no es necesario aquí si solo se muestran los que cumplen.
            if ($eliminar && !empty($idsProductosEliminarDefinitivo)) {
                $this->warn("Procediendo a eliminar " . count($idsProductosEliminarDefinitivo) . " productos...");
                try {
                    $productosEliminadosCount = 0;
                    // Eliminar en chunks también, por si son demasiados IDs para un solo IN (aunque raro para IDs)
                    foreach(array_chunk($idsProductosEliminarDefinitivo, 500) as $chunkParaEliminar) {
                         $productosEliminadosCount += Inventario::whereIn('id', $chunkParaEliminar)->delete();
                    }
                    $this->info("¡{$productosEliminadosCount} productos eliminados exitosamente!");
                } catch (\Exception $e) {
                    $this->error("Error al eliminar productos: " . $e->getMessage());
                    return Command::FAILURE;
                }
            } elseif ($dryRun) {
                $this->info("Modo 'dry-run': No se realizó ninguna eliminación. " . count($idsProductosEliminarDefinitivo) . " productos habrían sido eliminados.");
            } else {
                 $this->info(count($idsProductosEliminarDefinitivo) . " productos cumplen los criterios. Para eliminarlos, ejecuta el comando con la opción --eliminar.");
                 $this->info("Para simular la eliminación, ejecuta el comando con la opción --dry-run.");
            }
        }
        // No es necesario un 'else' aquí porque ya se manejó el caso de $idsUnicosParaProcesar->isEmpty()
        
        $this->info('Tarea de evaluación de productos completada.');


        $this->info('PROCESANDO SINCRONIZACION DE INVENTARIO');
        $controller->getAllInventarioFromCentral()->then(function() use ($controller) {
            $this->info('PROCESANDO SEND ALL TEST');
            $controller->sendAllTest();
        });
        return Command::SUCCESS;
    }
}
