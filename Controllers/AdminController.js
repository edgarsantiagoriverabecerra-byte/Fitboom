const API_BASE = "../Controllers/AdminController.php"; // Ajusta según tu endpoint o router PHP

export class AdminController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // INDEX: Resumen general del panel Admin
  async index() {
    try {
      const response = await fetch(`${this.apiUrl}?action=index`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Error al cargar el panel de administración.");
      }

      const usuarios = Array.isArray(data.usuarios) ? data.usuarios : [];
      const membresias = Array.isArray(data.membresias) ? data.membresias : [];

      const adminUser =
        data.adminUser ||
        usuarios.find((u) => {
          const rol = (u.rol || "").toLowerCase();
          return rol === "admin" || rol === "administrador" || rol.includes("admin");
        }) ||
        usuarios[0] ||
        null;

      const staffList =
        data.staffList ||
        usuarios.filter((u) => {
          const rol = (u.rol || "").toLowerCase();
          return (
            rol.includes("entrenador") ||
            rol.includes("trainer") ||
            rol.includes("nutricionista") ||
            rol.includes("staff")
          );
        });

      return {
        ok: true,
        nombreAdmin: adminUser?.nombre || "Admin Central",
        totalUsuarios: data.totalUsuarios ?? usuarios.length,
        membresiasList: membresias,
        staffList,
        todosLosUsuarios: usuarios,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "No se pudo obtener la información del panel Admin.",
      };
    }
  }

  // ==========================================
  // USUARIOS, MEMBRESÍAS Y PROFESIONALES

  async usuarios() {
    try {
      const response = await fetch(`${this.apiUrl}?action=usuarios`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Error al obtener usuarios.");
      }

      return { ok: true, usuarios: data.data ?? data.usuarios ?? [] };
    } catch (error) {
      return { ok: false, usuarios: [], message: error.message };
    }
  }

  async membresias() {
    try {
      const response = await fetch(`${this.apiUrl}?action=membresias`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Error al obtener membresías.");
      }

      return { ok: true, membresias: data.data ?? data.membresias ?? [] };
    } catch (error) {
      return { ok: false, membresias: [], message: error.message };
    }
  }

  async profesionales() {
    try {
      const response = await fetch(`${this.apiUrl}?action=profesionales`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Error al obtener profesionales.");
      }

      const lista = data.data ?? data.profesionales ?? [];
      const filtrados = lista.filter((u) => {
        const rol = (u.rol || "").toLowerCase();
        return (
          rol.includes("entrenador") ||
          rol.includes("trainer") ||
          rol.includes("nutricionista") ||
          rol.includes("profesional")
        );
      });

      return { ok: true, profesionales: filtrados };
    } catch (error) {
      return { ok: false, profesionales: [], message: error.message };
    }
  }

  // VISTAS: ALIMENTOS, RUTINAS Y CONFIGURACIÓN
  alimentos() {
    return { redirectUrl: "/Views/Admin/Alimentos.html" };
  }

  rutinas() {
    return { redirectUrl: "/Views/Admin/Rutinas.html" };
  }

  configuracion() {
    return { redirectUrl: "/Views/Admin/Configuracion.html" };
  }

  // PERFIL ADMIN: GET Y POST
  async obtenerPerfil() {
    const emailSesion = sessionStorage.getItem("UsuarioEmail") || "SantiagoR@gmail.com";

    try {
      const response = await fetch(
        `${this.apiUrl}?action=perfil&correo=${encodeURIComponent(emailSesion)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.ok || !data.usuario) {
        return {
          ok: false,
          redirectUrl: "/Views/Admin/Index.html",
          message: data.message || "No se encontró el perfil del administrador.",
        };
      }

      return { ok: true, usuario: data.usuario };
    } catch (error) {
      return {
        ok: false,
        redirectUrl: "/Views/Admin/Index.html",
        message: "Error al cargar el perfil del administrador.",
      };
    }
  }

  async actualizarPerfil(model = {}, fotoUrl = "") {
    const payload = {
      idUsuario: model.idUsuario ?? model.IdUsuario,
      nombre: (model.nombre ?? model.Nombre ?? "").trim(),
      apellido: (model.apellido ?? model.Apellido ?? "").trim(),
      correo: (model.correo ?? model.Correo ?? "").trim(),
      rol: (model.rol ?? model.Rol ?? "").trim(),
      fotoUrl: (fotoUrl ?? model.fotoUrl ?? model.FotoUrl ?? "").trim(),
    };

    try {
      const response = await fetch(`${this.apiUrl}?action=perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "No se pudo actualizar el perfil.",
        };
      }

      const actualizado = data.usuario || payload;

      if (actualizado.nombre) {
        sessionStorage.setItem("UsuarioNombre", actualizado.nombre);
      }
      if (actualizado.correo) {
        sessionStorage.setItem("UsuarioEmail", actualizado.correo);
      }
      if (payload.fotoUrl) {
        sessionStorage.setItem("UsuarioFoto", payload.fotoUrl);
      }

      const ahora = new Date();
      const hora = ahora.toTimeString().slice(0, 5); // Formato HH:mm
      const ultimaNotificacion = `Cambio realizado: Perfil de ${actualizado.nombre || "Usuario"} actualizado a las ${hora}`;

      sessionStorage.setItem("UltimaNotificacion", ultimaNotificacion);
      sessionStorage.setItem("TieneNotificacion", "true");

      return {
        ok: true,
        usuario: actualizado,
        ultimaNotificacion,
        message: "Perfil, rol y foto actualizados correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Error de conexión al guardar el perfil.",
      };
    }
  }
}

export const adminController = new AdminController();