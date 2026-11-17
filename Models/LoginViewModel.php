<?php


class LoginViewModel
{
    public string $email = "";
    public string $password = "";
    public bool $rememberMe = false;

    public function __construct(
        string $email = "",
        string $password = "",
        bool $rememberMe = false
    ) {
        $this->email = $email;
        $this->password = $password;
        $this->rememberMe = $rememberMe;
    }

    /**
     * Ejemplo básico de validación manual en PHP puro 
     * (si no estás usando un framework que lo haga automáticamente).
     */
    public function validar(): array
    {
        $errores = [];

        // Validación de Correo Obligatorio y Formato
        if (empty(trim($this->email))) {
            $errores['email'] = "El correo es obligatorio.";
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errores['email'] = "Ingresa un correo electrónico válido.";
        }

        // Validación de Contraseña Obligatoria
        if (empty($this->password)) {
            $errores['password'] = "La contraseña es obligatoria.";
        }

        return $errores;
    }
}