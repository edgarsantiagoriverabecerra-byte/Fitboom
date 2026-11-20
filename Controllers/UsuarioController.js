const API_BASE = "../Controllers/UsuarioController.php"; // Ajusta según tu endpoint o router PHP

export class UsurioController {
  constructor(apiUrl = API_BASE) {
    this.apiUrl = apiUrl;
  }

  // Valida que returnUrl sea una ruta local segura (evita open redirect)
  esUrlLocal(returnUrl = "") {
    if (typeof returnUrl !== "string") return false;
    const trimmed = returnUrl.trim();
    return trimmed.startsWith("/") && !trimmed.startsWith("//");
  }

  // INDEX: Vista principal del usuario
  index() {
    return {
      ok: true,
      redirectUrl: "/Views/Usuario/Index.html",
    };
  }

  // LOGIN (POST)
  async login(model = {}, returnUrl = null) {
    const email = (model.email ?? model.Email ?? "").trim();
    const password = model.password ?? model.Password ?? "";
    const rememberMe = Boolean(model.rememberMe ?? model.RememberMe ?? false);

    const errors = [];
    if (!email) {
      errors.push("El correo electrónico es obligatorio.");
    }
    if (!password) {
      errors.push("La contraseña es obligatoria.");
    }

    if (errors.length > 0) {
      return {
        ok: false,
        errors,
        message: "Intento de inicio de sesión no válido.",
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          returnUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return {
          ok: false,
          errors: [data.message || "Intento de inicio de sesión no válido."],
          message: data.message || "Intento de inicio de sesión no válido.",
        };
      }

      if (data.usuario?.id !== undefined) {
        sessionStorage.setItem("UsuarioId", String(data.usuario.id));
      }
      if (email) {
        sessionStorage.setItem("UsuarioEmail", email);
      }
      if (rememberMe) {
        localStorage.setItem("UsuarioRecordadoEmail", email);
      } else {
        localStorage.removeItem("UsuarioRecordadoEmail");
      }

      const redirectUrl = this.esUrlLocal(returnUrl)
        ? returnUrl.trim()
        : data.redirectUrl || "/Views/Usuario/Index.html";

      return {
        ok: true,
        redirectUrl,
        usuario: data.usuario ?? null,
        message: data.message || "Inicio de sesión exitoso.",
      };
    } catch {
      return {
        ok: false,
        errors: ["Intento de inicio de sesión no válido."],
        message: "Error de conexión al intentar iniciar sesión.",
      };
    }
  }

  // NUTRICIÓN (GET)
  nutricion() {
    return {
      ok: true,
      viewPath: "~/Views/Cliente/NutricionU.cshtml",
      redirectUrl: "/Views/Cliente/NutricionU.html",
    };
  }
}

export const usurioController = new UsurioController();