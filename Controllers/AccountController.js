const API_BASE = "../Controllers/AccountController.php"; // Ajusta la ruta si usas otro router/endpoint
const FOTO_POR_DEFECTO = "/images/imagen predeterminada.jpg";

export class AccountController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // Normaliza correo y contraseña sin importar el nombre del input en el formulario
  extraerCredenciales(payload = {}) {
    const correoFinal = (
      payload.correo ??
      payload.email ??
      payload.Email ??
      ""
    ).trim();

    const contrasenaFinal = (
      payload.contrasena ??
      payload.password ??
      payload.Password ??
      ""
    );

    return { correoFinal, contrasenaFinal };
  }

  // Determina la ruta de destino según el rol del usuario
  resolverRutaPorRol(rol = "") {
    const rolNormalizado = rol.toLowerCase().trim();

    if (rolNormalizado.includes("admin")) return "/Views/Admin/Index.html";
    if (rolNormalizado.includes("entrenador")) return "/Views/Entrenador/Index.html";
    if (rolNormalizado.includes("nutricion")) return "/Views/Nutricionista/Index.html";
    if (rolNormalizado.includes("cliente")) return "/Views/Cliente/Index.html";

    return null;
  }

  // ==========================================
  // LOGIN
  // ==========================================
  async login(payload = {}) {
    const { correoFinal, contrasenaFinal } = this.extraerCredenciales(payload);

    if (!correoFinal || !contrasenaFinal) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Por favor ingresa tanto el correo como la contraseña.",
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          correo: correoFinal,
          contrasena: contrasenaFinal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok || !data.usuario) {
        return {
          ok: false,
          redirectUrl: "/Views/Home/Index.html",
          message:
            data.message ||
            "Usuario o contraseña incorrectos. No registrado en FITBOOM.",
        };
      }

      const usuario = {
        id: data.usuario.id,
        nombre: data.usuario.nombre || "Usuario",
        rol: data.usuario.rol || "Cliente",
        foto: data.usuario.fotoRuta || FOTO_POR_DEFECTO,
      };

      const destino = this.resolverRutaPorRol(usuario.rol);
      if (!destino) {
        return {
          ok: false,
          redirectUrl: "/Views/Home/Index.html",
          message: "El usuario no tiene un rol válido asignado.",
        };
      }

      sessionStorage.setItem("UsuarioId", String(usuario.id));
      sessionStorage.setItem("UsuarioNombre", usuario.nombre);
      sessionStorage.setItem("UsuarioRol", usuario.rol);
      sessionStorage.setItem("UsuarioFoto", usuario.foto);

      return {
        ok: true,
        usuario,
        redirectUrl: destino,
        message: "Inicio de sesión exitoso.",
      };
    } catch (error) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Error de conexión al intentar iniciar sesión.",
      };
    }
  }

  // ==========================================
  // VER PERFIL (GET)
  // ==========================================
  async obtenerPerfil() {
    try {
      const response = await fetch(`${this.apiUrl}?action=perfil`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.ok || !data.perfil) {
        return {
          ok: false,
          redirectUrl: "/Views/Home/Index.html",
          message: data.message || "Sesión no iniciada.",
        };
      }

      const perfil = {
        id: data.perfil.id,
        nombre: data.perfil.nombre || "Usuario",
        correo: data.perfil.correo || "",
        rol: data.perfil.rol || "Cliente",
        fotoRuta: data.perfil.fotoRuta || FOTO_POR_DEFECTO,
        restriccionesAlimenticias: data.perfil.restriccionesAlimenticias || "",
      };

      return { ok: true, perfil };
    } catch (error) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "No se pudo obtener el perfil del usuario.",
      };
    }
  }

  // ==========================================
  // EDITAR PERFIL + SUBIR FOTO (POST)
  // ==========================================
  async actualizarPerfil({ nombre, restriccionesAlimenticias, fotoArchivo }) {
    const formData = new FormData();
    formData.append("nombre", (nombre ?? "").trim());
    formData.append("restriccionesAlimenticias", restriccionesAlimenticias ?? "");

    if (fotoArchivo && fotoArchivo.size > 0) {
      formData.append("fotoArchivo", fotoArchivo);
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=perfil`, {
        method: "POST",
        credentials: "include",
        body: formData, // No poner Content-Type manual con FormData
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo actualizar el perfil.",
        };
      }

      const nombreActualizado = nombre?.trim() || "Usuario";
      sessionStorage.setItem("UsuarioNombre", nombreActualizado);

      if (data.fotoRuta) {
        sessionStorage.setItem("UsuarioFoto", data.fotoRuta);
      }

      return {
        ok: true,
        fotoRuta: data.fotoRuta,
        message: data.message || "Perfil actualizado correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error de red al guardar los cambios del perfil.",
      };
    }
  }

  // ==========================================
  // CAMBIAR CONTRASEÑA (POST)
  // ==========================================
  async cambiarContrasena({
    contrasenaActual,
    nuevaContrasena,
    confirmarContrasena,
  }) {
    if (nuevaContrasena !== confirmarContrasena) {
      return {
        ok: false,
        message: "La nueva contraseña y su confirmación no coinciden.",
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=cambiarContrasena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contrasenaActual,
          nuevaContrasena,
          confirmarContrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "La contraseña actual no es correcta.",
        };
      }

      return {
        ok: true,
        message: data.message || "Contraseña actualizada correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error al intentar cambiar la contraseña.",
      };
    }
  }

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================
  async logout() {
    try {
      await fetch(`${this.apiUrl}?action=logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      sessionStorage.clear();
    }

    return {
      ok: true,
      redirectUrl: "/Views/Home/Index.html",
    };
  }
}

export const accountController = new AccountController();