<?php


class ClienteDashboardViewModel
{
    public string $nombre = "";
    public string $fotoUrl = "";
    public int $progresoPorcentaje = 0;

    // Macros
    public int $caloriasActuales = 0;
    public int $caloriasTotales = 0;
    public int $proteinaActual = 0;
    public int $proteinaMeta = 0;
    public int $carboActual = 0;
    public int $carboMeta = 0;
    public int $grasaActual = 0;
    public int $grasaMeta = 0;

    // Hidratación
    public int $vasosAgua = 0;
    public int $vasosMeta = 8;

 
    public array $alimentosHoy;

    public function __construct(
        string $nombre = "",
        string $fotoUrl = "",
        int $progresoPorcentaje = 0,
        int $caloriasActuales = 0,
        int $caloriasTotales = 0,
        int $proteinaActual = 0,
        int $proteinaMeta = 0,
        int $carboActual = 0,
        int $carboMeta = 0,
        int $grasaActual = 0,
        int $grasaMeta = 0,
        int $vasosAgua = 0,
        int $vasosMeta = 8,
        array $alimentosHoy = []
    ) {
        $this->nombre = $nombre;
        $this->fotoUrl = $fotoUrl;
        $this->progresoPorcentaje = $progresoPorcentaje;
        $this->caloriasActuales = $caloriasActuales;
        $this->caloriasTotales = $caloriasTotales;
        $this->proteinaActual = $proteinaActual;
        $this->proteinaMeta = $proteinaMeta;
        $this->carboActual = $carboActual;
        $this->carboMeta = $carboMeta;
        $this->grasaActual = $grasaActual;
        $this->grasaMeta = $grasaMeta;
        $this->vasosAgua = $vasosAgua;
        $this->vasosMeta = $vasosMeta;
        $this->alimentosHoy = $alimentosHoy;
    }
}

class ConsumoAlimentoDto
{
    public string $nombre = "";
    public string $tipoComida = ""; // Desayuno, Almuerzo, Cena, Snack
    public int $cantidadGramos = 0;
    public int $calorias = 0;
    public string $icono = "";

    public function __construct(
        string $nombre = "",
        string $tipoComida = "",
        int $cantidadGramos = 0,
        int $calorias = 0,
        string $icono = ""
    ) {
        $this->nombre = $nombre;
        $this->tipoComida = $tipoComida;
        $this->cantidadGramos = $cantidadGramos;
        $this->calorias = $calorias;
        $this->icono = $icono;
    }
}