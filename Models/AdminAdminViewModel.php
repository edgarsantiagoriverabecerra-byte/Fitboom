<?php

class Profesional
{
    public int $id = 0;
    public string $nombre = "";
    public string $especialidad = ""; // Ej: NUTRICIONISTA, MASTER COACH, FISIOTERAPEUTA
    public ?string $fotoUrl = null;
    public bool $activo = true;

    public function __construct(
        int $id = 0,
        string $nombre = "",
        string $especialidad = "",
        ?string $fotoUrl = null,
        bool $activo = true
    ) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->especialidad = $especialidad;
        $this->fotoUrl = $fotoUrl;
        $this->activo = $activo;
    }
}

class AdminDashboardViewModel
{
   
    public array $staffProfesional;

    public function __construct(array $staffProfesional = [])
    {
        $this->staffProfesional = $staffProfesional;
    }
}