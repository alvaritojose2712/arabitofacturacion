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
                            {--M|meses=6 : Número de meses sin ventas para considerar un producto obsoleto (para la condición 1).}
                            {--D|dry-run : Ejecutar el comando sin eliminar productos, solo mostrarlos.}
                            {--E|eliminar : Ejecutar el comando y eliminar los productos que cumplen los criterios (USAR CON PRECAUCIÓN).}';

   
    protected $description = 'Evalúa y opcionalmente elimina productos que: 1) Tienen cantidad 0 y sin ventas recientes (por defecto, 6 meses). O 2) Tienen cantidad 0 y precio 0.';

 
    public function __construct()
    {
        parent::__construct();
    }

  
    public function handle()
    {
        $mesesSinVentas = (int) $this->option('meses');
        if ($mesesSinVentas <= 0) {
            $this->error('El número de meses debe ser un entero positivo.');
            return Command::FAILURE;
        }

        $dryRun = $this->option('dry-run');
        $eliminar = $this->option('eliminar');

        if ($eliminar && $dryRun) {
            $this->error('No puedes usar --dry-run y --eliminar al mismo tiempo.');
            return Command::FAILURE;
        }
        
        $confirmMessage = "¿Estás SEGURO de que quieres ELIMINAR los productos que cumplen con CUALQUIERA de estos criterios?:\n";
        $confirmMessage .= "1. Cantidad = 0 Y sin ventas en {$mesesSinVentas} meses.\n";
        $confirmMessage .= "2. Cantidad = 0 Y Precio = 0.\n";
        $confirmMessage .= "Esta acción es IRREVERSIBLE.";


        if ($eliminar && !$this->confirm($confirmMessage)) {
            $this->info('Operación de eliminación cancelada por el usuario.');
            return Command::SUCCESS;
        }

        $this->info("Iniciando evaluación de productos...");
        $this->line("Criterio 1: Cantidad = 0 Y sin ventas en los últimos {$mesesSinVentas} meses.");
        $this->line("Criterio 2: Cantidad = 0 Y Precio = 0.");


        // Fecha límite para la última venta (Criterio 1)
        $fechaLimite = Carbon::now()->subMonths($mesesSinVentas);

        // IDs de productos que cumplen al menos una condición
        $idsProductosParaProcesar = collect();

        // Obtener IDs para Criterio 1: Cantidad 0 y sin ventas recientes
        $idsCriterio1 = inventario::where('cantidad', 0)
            ->whereDoesntHave('items_pedidos', function (Builder $query) use ($fechaLimite) {
                $query->where('created_at', '>=', $fechaLimite);
            })
            ->pluck('id');
        
        $idsProductosParaProcesar = $idsProductosParaProcesar->merge($idsCriterio1);
        $this->info(count($idsCriterio1) . " productos encontrados para el Criterio 1 (cantidad 0, sin ventas en {$mesesSinVentas} meses).");

        // Obtener IDs para Criterio 2: Cantidad 0 y Precio 0
        // Asegúrate de que tu modelo inventario tenga un campo 'precio' o ajústalo.
        $idsCriterio2 = inventario::where('cantidad', 0)
            ->where('precio', 0) // Asume que tienes un campo 'precio' en tu tabla 'inventarios'
            ->pluck('id');
        
        $idsProductosParaProcesar = $idsProductosParaProcesar->merge($idsCriterio2);
        $this->info(count($idsCriterio2) . " productos encontrados para el Criterio 2 (cantidad 0, precio 0).");

        // Unificar IDs para no procesar dos veces
        $idsUnicosParaProcesar = $idsProductosParaProcesar->unique()->values();
        
        $contadorProductosEncontrados = 0;
        $idsProductosEliminarDefinitivo = [];


        if ($idsUnicosParaProcesar->isEmpty()) {
            $this->info("No se encontraron productos que cumplan con los criterios establecidos.");
            return Command::SUCCESS;
        }
        
        $this->info("Procesando " . $idsUnicosParaProcesar->count() . " productos únicos que cumplen al menos un criterio.");

        // Procesar en chunks para no agotar la memoria
        foreach (array_chunk($idsUnicosParaProcesar->all(), 200) as $chunkDeIds) {
            $productos = inventario::whereIn('id', $chunkDeIds)->get();

            foreach ($productos as $producto) {
                $contadorProductosEncontrados++;
                $this->line("--------------------------------------------------");
                $this->info("Producto ID: <options=bold>{$producto->id}</> | Descripción: <options=bold>{$producto->descripcion}</> | Cantidad: {$producto->cantidad} | Precio: {$producto->precio}");

                // Determinar y mostrar qué criterios cumple
                $cumpleCriterio1 = $idsCriterio1->contains($producto->id);
                $cumpleCriterio2 = $idsCriterio2->contains($producto->id);

                if ($cumpleCriterio1) {
                     $this->comment("-> Cumple Criterio 1: Cantidad 0 y sin ventas en {$mesesSinVentas} meses.");
                }
                if ($cumpleCriterio2) {
                     $this->comment("-> Cumple Criterio 2: Cantidad 0 y Precio 0.");
                }


                if ($eliminar) {
                    $idsProductosEliminarDefinitivo[] = $producto->id;
                    $this->warn("MARCADO PARA ELIMINAR: Producto ID {$producto->id}");
                } elseif ($dryRun) {
                    $this->comment("(Dry run) Producto ID {$producto->id} sería eliminado.");
                } else {
                    $this->comment("Para eliminar, usa la opción --eliminar. Para simular, usa --dry-run.");
                }
            }
        }
        
        $this->line("==================================================");

        if ($contadorProductosEncontrados > 0) {
            $this->info("Se evaluaron {$contadorProductosEncontrados} productos que cumplen al menos un criterio.");
            if ($eliminar && !empty($idsProductosEliminarDefinitivo)) {
                $this->warn("Procediendo a eliminar " . count($idsProductosEliminarDefinitivo) . " productos...");
                try {
                    // Eliminar en un solo query para eficiencia
                    inventario::whereIn('id', $idsProductosEliminarDefinitivo)->delete();
                    $this->info("¡" . count($idsProductosEliminarDefinitivo) . " productos eliminados exitosamente!");
                } catch (\Exception $e) {
                    $this->error("Error al eliminar productos: " . $e->getMessage());
                    return Command::FAILURE;
                }
            } elseif ($dryRun) {
                $this->info("Modo 'dry-run': No se realizó ninguna eliminación.");
            } else {
                 $this->info("Para eliminar estos productos, ejecuta el comando con la opción --eliminar.");
                 $this->info("Para simular la eliminación, ejecuta el comando con la opción --dry-run.");
            }
        }
        // No es necesario un 'else' aquí porque ya se manejó el caso de $idsUnicosParaProcesar->isEmpty()
        
        $this->info('Tarea de evaluación de productos completada.');
        return Command::SUCCESS;
    }
}
