const API_BASE = "../Controllers/HomeController.php"; // Ajusta según tu endpoint o router PHP

export class HomeController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // Verifica si hay sesión activa (usando sessionStorage o consultando al backend)
  async estaAutenticado() {
    const idEnSesion = sessionStorage.getItem("UsuarioId");
    if (idEnSesion) {
      return true;
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=estadoSesion`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) return false;
      const data = await response.json();
      return Boolean(data.autenticado);
    } catch {
      return false;
    }
  }

  // INDEX: Redirige si ya está autenticado
  async index() {
    const autenticado = await this.estaAutenticado();

    if (autenticado) {
      return {
        autenticado: true,
        redirectUrl: "/Views/Usuario/Index.html",
      };
    }

    return {
      autenticado: false,
      redirectUrl: "/Views/Home/Index.html",
    };
  }

  // PRIVACY: Ruta protegida ([Authorize])
  async privacy() {
    const autenticado = await this.estaAutenticado();

    if (!autenticado) {
      return {
        autorizado: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Debes iniciar sesión para acceder a Privacidad.",
      };
    }

    return {
      autorizado: true,
      redirectUrl: "/Views/Home/Privacy.html",
    };
  }

  // ERROR: Obtiene datos de ErrorViewModel
  async obtenerError(requestId = null) {
    const traceId =
      requestId ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()));

    try {
      const response = await fetch(
        `${this.apiUrl}?action=error&requestId=${encodeURIComponent(traceId)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          requestId: data.requestId || traceId,
          showRequestId: Boolean(data.requestId || traceId),
          message: data.message || "Ha ocurrido un error inesperado.",
        };
      }
    } catch {
      // Si falla la petición, devolvemos el modelo de error local
    }

    return {
      requestId: traceId,
      showRequestId: Boolean(traceId),
      message: "Ha ocurrido un error inesperado.",
    };
  }
}

export const homeController = new HomeController();