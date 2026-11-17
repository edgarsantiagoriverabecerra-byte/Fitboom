<?php

class Usuario
{
    public int $idUsuario = 0;
    public string $nombre = "";
    public string $apellido = "";
    public string $correo = "";
    public string $contraseña = "";
    public string $rol = "";
    public ?string $fotoRuta = null;
    public ?string $restriccionesAlimenticias = null;
    public bool $activo = true;

    // Opcional: Constructor para inicializar valores fácilmente si lo deseas
    public function __construct(
        int $idUsuario = 0,
        string $nombre = "",
        string $apellido = "",
        string $correo = "",
        string $contraseña = "",
        string $rol = "",
        ?string $fotoRuta = null,
        ?string $restriccionesAlimenticias = null,
        bool $activo = true
    ) {
        $this->idUsuario = $idUsuario;
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->correo = $correo;
        $this->contraseña = $contraseña;
        $this->rol = $rol;
        $this->fotoRuta = $fotoRuta;
        $this->restriccionesAlimenticias = $restriccionesAlimenticias;
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