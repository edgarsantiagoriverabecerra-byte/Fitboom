const API_BASE = "../Controllers/ClienteController.php"; // Ajusta según tu endpoint o router PHP
const FOTO_POR_DEFECTO = "/images/imagen predeterminada.jpg";
const PLAN_POR_DEFECTO = "PRO";

export class ClienteController {
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

  // CARGAR DATOS DEL USUARIO EN SESIÓN
  async cargarDatosUsuarioSesion(idUsuario = null) {
    const idFinal = this.obtenerIdUsuarioSesion(idUsuario);
    if (!idFinal) {
      return { ok: false, message: "Usuario no autenticado." };
    }

    try {
      const response = await fetch(
        `${this.apiUrl}?action=datosSesion&idUsuario=${encodeURIComponent(idFinal)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok || !data.ok || !data.usuario) {
        return {
          ok: false,
          message: data.message || "No se pudieron cargar los datos del cliente.",
        };
      }

      const usuario = {
        id: idFinal,
        nombre: data.usuario.nombre ?? sessionStorage.getItem("UsuarioNombre") ?? "Cliente",
        rol: data.usuario.rol ?? sessionStorage.getItem("UsuarioRol") ?? "Cliente",
        fotoRuta: data.usuario.fotoRuta || FOTO_POR_DEFECTO,
        plan:
          sessionStorage.getItem("UsuarioPlan") ||
          data.usuario.plan ||
          PLAN_POR_DEFECTO,
      };

      sessionStorage.setItem("UsuarioId", String(usuario.id));
      sessionStorage.setItem("UsuarioNombre", usuario.nombre);
      sessionStorage.setItem("UsuarioRol", usuario.rol);
      sessionStorage.setItem("UsuarioFoto", usuario.fotoRuta);
      sessionStorage.setItem("UsuarioPlan", usuario.plan);

      return { ok: true, usuario };
    } catch (error) {
      return {
        ok: false,
        message: "Error de conexión al cargar los datos del cliente.",
      };
    }
  }

  // INDEX: Vista principal / Nutrición cliente
  async index() {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        autorizado: false,
        redirectUrl: "/Views/Home/Index.html",
      };
    }

    const sesion = await this.cargarDatosUsuarioSesion(idUsuario);

    return {
      autorizado: true,
      viewPath: "~/Views/Cliente/Index.cshtml",
      redirectUrl: "/Views/Cliente/Index.html",
      usuario: sesion.usuario || null,
    };
  }

  // RUTINAS: Vista de rutinas de entrenamiento
  async rutinas() {
    const idUsuario = this.obtenerIdUsuarioSesion();
    if (!idUsuario) {
      return {
        autorizado: false,
        redirectUrl: "/Views/Home/Index.html",
      };
    }

    const sesion = await this.cargarDatosUsuarioSesion(idUsuario);

    return {
      autorizado: true,
      viewPath: "~/Views/Cliente/Rutinas.cshtml",
      redirectUrl: "/Views/Cliente/Rutinas.html",
      usuario: sesion.usuario || null,
    };
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
      return { ok: false, data: null, message: "Error al consultar el detalle." };
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
          message: data.message || "No se pudo crear el registro.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/Cliente/Index.html",
        data: data.data ?? null,
        message: data.message || "Registro creado correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al crear el registro.",
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
          message: data.message || "No se pudo actualizar el registro.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/Cliente/Index.html",
        data: data.data ?? null,
        message: data.message || "Registro actualizado correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al actualizar el registro.",
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
          message: data.message || "No se pudo eliminar el registro.",
        };
      }

      return {
        ok: true,
        redirectUrl: "/Views/Cliente/Index.html",
        message: data.message || "Registro eliminado correctamente.",
      };
    } catch {
      return {
        ok: false,
        message: "Error de conexión al eliminar el registro.",
      };
    }
  }
}

export const clienteController = new ClienteController();