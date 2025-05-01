<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function viewReport($type)
    {
        $reportPath = storage_path('app/reports');
        $filepath = "{$reportPath}/{$type}_report.html";
        
        // Create directory if it doesn't exist
        if (!file_exists($reportPath)) {
            mkdir($reportPath, 0755, true);
        }
        
        // Create initial file if it doesn't exist
        if (!file_exists($filepath)) {
            $html = "<!DOCTYPE html>
            <html>
            <head>
                <title>{$type} Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .section { margin-bottom: 30px; }
                    .section-title { color: #333; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>{$type} Report</h1>
                <p>No hay movimientos registrados aún.</p>
            </body>
            </html>";
            
            file_put_contents($filepath, $html);
        }
        
        if (file_exists($filepath)) {
            return response()->file($filepath);
        }
        
        return response()->json(['error' => 'No se pudo crear el reporte'], 500);
    }

    public function generateReport($type, $data)
    {
        try {
            $reportPath = storage_path('app/reports');
            Log::info('Generando reporte en: ' . $reportPath);
            
            if (!file_exists($reportPath)) {
                Log::info('Creando directorio de reportes');
                if (!mkdir($reportPath, 0755, true)) {
                    Log::error('No se pudo crear el directorio de reportes');
                    return false;
                }
            }

            $filename = "{$type}_report.html";
            $filepath = "{$reportPath}/{$filename}";
            
            // If file doesn't exist, create initial HTML
            if (!file_exists($filepath)) {
                $html = "<!DOCTYPE html>
                <html>
                <head>
                    <title>{$type} Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .section { margin-bottom: 30px; }
                        .section-title { color: #333; margin-bottom: 10px; }
                    </style>
                </head>
                <body>
                    <h1>{$type} Report</h1>";
            } else {
                // Read existing content
                $html = file_get_contents($filepath);
                // Remove closing body and html tags
                $html = str_replace("</body></html>", "", $html);
            }

            // Add new section
            $html .= "<div class='section'>";
            $html .= "<h2 class='section-title'>" . date('Y-m-d H:i:s') . "</h2>";

            if ($type === 'tasks') {
                $html .= "<table>
                    <tr>
                        <th>ID Tarea</th>
                        <th>Producto Original</th>
                        <th>Producto Reemplazo</th>
                        <th>Estado</th>
                        <th>Detalles</th>
                    </tr>";
                foreach ($data as $task) {
                    $html .= "<tr>
                        <td>{$task['id']}</td>
                        <td>{$task['original_product']}</td>
                        <td>{$task['replacement_product']}</td>
                        <td>{$task['status']}</td>
                        <td>{$task['details']}</td>
                    </tr>";
                }
            } else if ($type === 'inventory') {
                $html .= "<table>
                    <tr>
                        <th>ID Producto</th>
                        <th>Campo</th>
                        <th>Valor Anterior</th>
                        <th>Valor Nuevo</th>
                    </tr>";
                foreach ($data as $change) {
                    $html .= "<tr>
                        <td>{$change['product_id']}</td>
                        <td>{$change['field']}</td>
                        <td>{$change['old_value']}</td>
                        <td>{$change['new_value']}</td>
                    </tr>";
                }
            }

            $html .= "</table></div>";
            $html .= "</body></html>";
            
            if (file_put_contents($filepath, $html) === false) {
                Log::error('No se pudo escribir el archivo de reporte');
                return false;
            }
            
            Log::info('Reporte actualizado exitosamente: ' . $filepath);
            return $filepath;
        } catch (\Exception $e) {
            Log::error('Error al generar reporte: ' . $e->getMessage());
            return false;
        }
    }
} 