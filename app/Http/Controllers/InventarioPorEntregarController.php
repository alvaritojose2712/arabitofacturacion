<?php

namespace App\Http\Controllers;

use App\Models\inventario_por_entregar;
use App\Http\Requests\Storeinventario_por_entregarRequest;
use App\Http\Requests\Updateinventario_por_entregarRequest;

class InventarioPorEntregarController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Storeinventario_por_entregarRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Storeinventario_por_entregarRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\inventario_por_entregar  $inventario_por_entregar
     * @return \Illuminate\Http\Response
     */
    public function show(inventario_por_entregar $inventario_por_entregar)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\inventario_por_entregar  $inventario_por_entregar
     * @return \Illuminate\Http\Response
     */
    public function edit(inventario_por_entregar $inventario_por_entregar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Updateinventario_por_entregarRequest  $request
     * @param  \App\Models\inventario_por_entregar  $inventario_por_entregar
     * @return \Illuminate\Http\Response
     */
    public function update(Updateinventario_por_entregarRequest $request, inventario_por_entregar $inventario_por_entregar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\inventario_por_entregar  $inventario_por_entregar
     * @return \Illuminate\Http\Response
     */
    public function destroy(inventario_por_entregar $inventario_por_entregar)
    {
        //
    }
}
