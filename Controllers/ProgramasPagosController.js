const API_BASE = "../Controllers/ProgramasPagosController.php"; // Ajusta según tu endpoint o router PHP

export class ProgramasPagosController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // Obtiene idUsuario desde sesión
  obtenerIdUsuarioSesion() {
    const idGuardado = sessionStorage.getItem("UsuarioId");
    return idGuardado ? Number(idGuardado) : null;
  }

  // INDEX: Verifica sesión para vista principal
  index() {
    const idUsuario = this.obtenerIdUsuarioSesion();

    if (!idUsuario) {
      return {
        autorizado: false,
        redirectUrl: "/Views/Home/Index.html",
      };
    }

    return {
      autorizado: true,
      idUsuario,
      redirectUrl: "/Views/ProgramasPagos/Index.html",
    };
  }

  // GUARDAR MEMBRESÍA (POST)
  async guardarMembresia({
    id = 0,
    nombre = "",
    duracion = "",
    precio = 0,
    beneficios = "",
  } = {}) {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Sesión no iniciada.",
      };
    }

    const payload = {
      id: Number(id) || 0,
      nombre: String(nombre).trim(),
      duracion: String(duracion).trim(),
      precio: Number(precio) || 0,
      beneficios: String(beneficios).trim(),
    };

    try {
      const response = await fetch(`${this.apiUrl}?action=guardarMembresia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          redirectUrl: "/Views/ProgramasPagos/Index.html",
          message: data.message || "No se pudo guardar la membresía.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        data: data.data ?? payload,
        message: data.message || "Membresía guardada correctamente.",
      };
    } catch {
      return {
        ok: false,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        message: "Error de conexión al guardar la membresía.",
      };
    }
  }

  // ELIMINAR MEMBRESÍA
  async eliminarMembresia(id) {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Sesión no iniciada.",
      };
    }

    try {
      const response = await fetch(
        `${this.apiUrl}?action=eliminarMembresia&id=${encodeURIComponent(id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: Number(id) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          redirectUrl: "/Views/ProgramasPagos/Index.html",
          message: data.message || "No se pudo eliminar la membresía.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        message: data.message || "Membresía eliminada correctamente.",
      };
    } catch {
      return {
        ok: false,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        message: "Error de conexión al eliminar la membresía.",
      };
    }
  }

  // ==========================================
  // ANULAR PAGO
  // ==========================================
  async anularPago(id) {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Sesión no iniciada.",
      };
    }

    try {
      const response = await fetch(
        `${this.apiUrl}?action=anularPago&id=${encodeURIComponent(id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: Number(id) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          redirectUrl: "/Views/ProgramasPagos/Index.html",
          message: data.message || "No se pudo anular el pago.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        message: data.message || "Pago anulado correctamente.",
      };
    } catch {
      return {
        ok: false,
        redirectUrl: "/Views/ProgramasPagos/Index.html",
        message: "Error de conexión al anular el pago.",
      };
    }
  }
}

export const programasPagosController = new ProgramasPagosController();