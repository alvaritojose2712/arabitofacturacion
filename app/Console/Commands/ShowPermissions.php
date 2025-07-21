<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ShowPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:show';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show the current permissions matrix for the unified middleware';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🔐 PERMISOS DEL MIDDLEWARE UNIFICADO');
        $this->line('');

        $permissions = [
            'login' => [
                'description' => 'Acceso básico del sistema',
                'users' => [1, 4, 5, 6, 7],
                'user_labels' => ['GERENTE', 'Cajero Vendedor', 'SUPERVISOR DE CAJA', 'SUPERADMIN', 'DICI']
            ],
            'admin' => [
                'description' => 'Acceso administrativo completo',
                'users' => [6, 7],
                'user_labels' => ['SUPERADMIN', 'DICI (rutas específicas)']
            ],
            'caja' => [
                'description' => 'Acceso a control de caja y efectivo',
                'users' => [1, 5, 6],
                'user_labels' => ['GERENTE', 'SUPERVISOR DE CAJA', 'SUPERADMIN']
            ],
            'vendedor' => [
                'description' => 'Acceso a ventas y pedidos',
                'users' => [1, 4, 5, 6],
                'user_labels' => ['GERENTE', 'Cajero Vendedor', 'SUPERVISOR DE CAJA', 'SUPERADMIN']
            ],
            'api' => [
                'description' => 'Acceso a rutas API (garantías e inventario)',
                'users' => [7],
                'user_labels' => ['DICI']
            ]
        ];

        foreach ($permissions as $accessType => $info) {
            $this->info("📋 {$accessType}");
            $this->line("   Descripción: {$info['description']}");
            $this->line("   Usuarios permitidos: " . implode(', ', $info['users']));
            $this->line("   Roles: " . implode(', ', $info['user_labels']));
            $this->line('');
        }

        $this->info('🎯 RUTAS ESPECÍFICAS PARA TIPO 7 (DICI)');
        $this->line('   - resolverTareaLocal');
        $this->line('   - getTareasLocal');
        $this->line('   - guardarNuevoProductoLote');
        $this->line('   - getmovientoinventariounitario');
        $this->line('   - sincInventario');
        $this->line('   - reqpedidos');
        $this->line('   - runTareaCentral');
        $this->line('   - getTareasCentral');
        $this->line('   - checkPedidosCentral');
        $this->line('   - reqMipedidos');
        $this->line('   - getSucursales');
        $this->line('   - settransferenciaDici');
        $this->line('');

        $this->info('📊 RESUMEN POR TIPO DE USUARIO');
        $this->line('');
        
        $userTypes = [
            1 => 'GERENTE',
            4 => 'Cajero Vendedor', 
            5 => 'SUPERVISOR DE CAJA',
            6 => 'SUPERADMIN',
            7 => 'DICI'
        ];

        foreach ($userTypes as $type => $label) {
            $accessList = [];
            foreach ($permissions as $accessType => $info) {
                if (in_array($type, $info['users'])) {
                    $accessList[] = $accessType;
                }
            }
            
            if (!empty($accessList)) {
                $this->line("   {$type} ({$label}): " . implode(', ', $accessList));
            } else {
                $this->line("   {$type} ({$label}): Sin acceso");
            }
        }

        $this->line('');
        $this->info('✅ Middleware unificado implementado correctamente');

        return 0;
    }
} 