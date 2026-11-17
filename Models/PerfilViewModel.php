<?php

namespace TuProyecto\Models;

class PerfilViewModel
{
    public int $id = 0;
    public string $nombre = "";
    public string $correo = "";
    public string $rol = "";
    public ?string $fotoRuta = null;
    public ?string $restriccionesAlimenticias = null;
    
    public ?array $fotoArchivo = null;

    public function __construct(
        int $id = 0,
        string $nombre = "",
        string $correo = "",
        string $rol = "",
        ?string $fotoRuta = null,
        ?string $restriccionesAlimenticias = null,
        ?array $fotoArchivo = null
    ) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->correo = $correo;
        $this->rol = $rol;
        $this->fotoRuta = $fotoRuta;
        $this->restriccionesAlimenticias = $restriccionesAlimenticias;
        $this->fotoArchivo = $fotoArchivo;
    }
}