const API_BASE = "../Controllers/MembresiasController.php"; // Ajusta según tu endpoint o router PHP
const PLAN_POR_DEFECTO = "PRO";

export class MembreciasController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // Obtiene idUsuario desde argumento o desde sesión
  obtenerIdUsuarioSesion(idUsuario = null) {
    if (idUsuario !== null && idUsuario !== undefined && idUsuario !== "") {
      return Number(idUsuario);
    }

    const idGuardado = sessionStorage.getItem("UsuarioId");
    return idGuardado ? Number(idGuardado) : null;
  }

  // ==========================================
  // LISTAR MEMBRESÍAS / PLANES DISPONIBLES
 
  async listar() {
    try {
      const response = await fetch(`${this.apiUrl}?action=listar`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          membresias: [],
          message: data.message || "No se pudieron cargar las membresías.",
        };
      }

      return {
        ok: true,
        membresias: data.data ?? data.membresias ?? [],
      };
    } catch {
      return {
        ok: false,
        membresias: [],
        message: "Error de conexión al consultar las membresías.",
      };
    }
  }

  // INDEX: Vista principal de membresías
  async index() {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        autorizado: false,
        redirectUrl: "/Views/Home/Index.html",
      };
    }

    const listado = await this.listar();

    return {
      autorizado: true,
      redirectUrl: "/Views/Membresias/Index.html",
      planActual: sessionStorage.getItem("UsuarioPlan") || PLAN_POR_DEFECTO,
      membresias: listado.membresias,
    };
  }

  // PLAN ACTUAL DEL USUARIO
  async planActual(idUsuario = null) {
    const idFinal = this.obtenerIdUsuarioSesion(idUsuario);
    if (!idFinal) {
      return {
        ok: false,
        plan: sessionStorage.getItem("UsuarioPlan") || PLAN_POR_DEFECTO,
        message: "Usuario no autenticado.",
      };
    }

    try {
      const response = await fetch(
        `${this.apiUrl}?action=planActual&idUsuario=${encodeURIComponent(idFinal)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          plan: sessionStorage.getItem("UsuarioPlan") || PLAN_POR_DEFECTO,
          message: data.message || "No se pudo obtener el plan actual.",
        };
      }

      const planNombre = data.plan || PLAN_POR_DEFECTO;
      sessionStorage.setItem("UsuarioPlan", planNombre);

      return {
        ok: true,
        plan: planNombre,
        membresia: data.membresia ?? null,
      };
    } catch {
      return {
        ok: false,
        plan: sessionStorage.getItem("UsuarioPlan") || PLAN_POR_DEFECTO,
        message: "Error de conexión al consultar el plan actual.",
      };
    }
  }

  // SUSCRIBIRSE / ACTIVAR MEMBRESÍA
  async suscribirse(idMembresia, idUsuario = null) {
    const idFinal = this.obtenerIdUsuarioSesion(idUsuario);
    if (!idFinal) {
      return {
        ok: false,
        redirectUrl: "/Views/Home/Index.html",
        message: "Debes iniciar sesión para activar una membresía.",
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=suscribirse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idUsuario: idFinal,
          idMembresia,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo activar la membresía.",
        };
      }

      if (data.plan) {
        sessionStorage.setItem("UsuarioPlan", data.plan);
      }

      return {
        ok: true,
        plan: data.plan || null,
        data: data.data ?? null,
        message: data.message || "Membresía activada correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al activar la membresía.",
      };
    }
  }

  // DETAILS, CREATE, EDIT Y DELETE
  async details(id) {
    try {
      const response = await fetch(
        `${this.apiUrl}?action=details&id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return {
        ok: response.ok && Boolean(data.ok),
        data: data.data ?? null,
        message: data.message || "",
      };
    } catch {
      return {
        ok: false,
        data: null,
        message: "Error al consultar el detalle de la membresía.",
      };
    }
  }

  async create(payload = {}) {
    try {
      const response = await fetch(`${this.apiUrl}?action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo crear la membresía.",
        };
      }

      return {
        ok: true,
        data: data.data ?? null,
        message: data.message || "Membresía creada correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al crear la membresía.",
      };
    }
  }

  async edit(id, payload = {}) {
    try {
      const response = await fetch(
        `${this.apiUrl}?action=edit&id=${encodeURIComponent(id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo actualizar la membresía.",
        };
      }

      return {
        ok: true,
        data: data.data ?? null,
        message: data.message || "Membresía actualizada correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al actualizar la membresía.",
      };
    }
  }

  async delete(id) {
    try {
      const response = await fetch(
        `${this.apiUrl}?action=delete&id=${encodeURIComponent(id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo eliminar la membresía.",
        };
      }

      return {
        ok: true,
        message: data.message || "Membresía eliminada correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al eliminar la membresía.",
      };
    }
  }
}

export const membreciasController = new MembreciasController();