// Portfolio de Álvaro Fernández Ortuño — interacción de la página.
// Sin librerías: menú del móvil, panel de estado de las demos (consulta de
// verdad cada servidor), galería de capturas, copiar el email y el
// formulario, que prepara un email.
(() => {
  "use strict";

  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  /* ------------------------------------------------------------ Cabecera */
  const cabecera = $("#cabecera");
  const botonMenu = $("#menu-boton");
  const menu = $("#menu");

  function abrirMenu(abrir) {
    cabecera.classList.toggle("menu-abierto", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
    botonMenu.textContent = abrir ? "Cerrar" : "Menú";
  }
  botonMenu.addEventListener("click", () => abrirMenu(!cabecera.classList.contains("menu-abierto")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cabecera.classList.contains("menu-abierto")) { abrirMenu(false); botonMenu.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (cabecera.classList.contains("menu-abierto") && !cabecera.contains(e.target)) abrirMenu(false);
  });

  const marcarCabecera = () => cabecera.classList.toggle("con-borde", window.scrollY > 8);
  addEventListener("scroll", marcarCabecera, { passive: true });
  marcarCabecera();

  // La sección que se está leyendo queda marcada en el menú.
  const enlacesMenu = new Map($$("a[href^='#']", menu).map((a) => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const vistaSeccion = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        const enlace = enlacesMenu.get(e.target.id);
        if (!enlace || !e.isIntersecting) continue;
        enlacesMenu.forEach((a) => { a.classList.remove("activo"); a.removeAttribute("aria-current"); });
        enlace.classList.add("activo");
        enlace.setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    enlacesMenu.forEach((_, id) => { const s = document.getElementById(id); if (s) vistaSeccion.observe(s); });
  }

  /* ------------------------------------------------ Galería de capturas */
  for (const grupo of $$(".miniaturas")) {
    const img = $(".navegador-img", grupo.closest(".proyecto-media"));
    let pedida = 0;
    grupo.addEventListener("click", (e) => {
      const boton = e.target.closest("button[data-src]");
      if (!boton || boton.getAttribute("aria-pressed") === "true") return;
      $$("button", grupo).forEach((b) => b.setAttribute("aria-pressed", String(b === boton)));
      const turno = ++pedida;
      const nueva = new Image();
      nueva.src = boton.dataset.src;
      img.classList.add("cambiando");
      const lista = nueva.decode ? nueva.decode().catch(() => {}) : Promise.resolve();
      Promise.all([lista, new Promise((r) => setTimeout(r, reducido ? 0 : 160))]).then(() => {
        if (turno !== pedida) return;
        img.src = boton.dataset.src;
        img.alt = boton.dataset.alt || "";
        requestAnimationFrame(() => img.classList.remove("cambiando"));
      });
    });
    // Las otras capturas se cargan en cuanto pasas el ratón por encima.
    grupo.addEventListener("pointerenter", () => {
      $$("button[data-src]", grupo).forEach((b) => { const i = new Image(); i.src = b.dataset.src; });
    }, { once: true });
  }

  /* ------------------------------------------------------ Copiar email */
  for (const boton of $$("[data-copiar]")) {
    boton.addEventListener("click", async () => {
      const texto = boton.dataset.copiar;
      let ok = false;
      try {
        await navigator.clipboard.writeText(texto);
        ok = true;
      } catch (_) {
        const area = document.createElement("textarea");
        area.value = texto;
        area.setAttribute("readonly", "");
        area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.append(area);
        area.select();
        try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
        area.remove();
      }
      boton.textContent = ok ? "Copiado" : "Cópialo a mano";
      boton.classList.toggle("hecho", ok);
      clearTimeout(boton._espera);
      boton._espera = setTimeout(() => { boton.textContent = "Copiar"; boton.classList.remove("hecho"); }, 2200);
    });
  }

  /* -------------------------------------- Formulario: prepara un email */
  const formulario = $("#formulario");
  if (formulario) {
    const nota = $("#f-nota");
    const notaInicial = nota.textContent;
    const campos = formulario.elements;
    for (const nombre of ["nombre", "mensaje"]) {
      campos[nombre].addEventListener("input", () => {
        if (campos[nombre].value.trim()) campos[nombre].removeAttribute("aria-invalid");
      });
    }
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = campos.nombre.value.trim();
      const motivo = campos.motivo.value;
      const mensaje = campos.mensaje.value.trim();
      const faltan = [];
      if (!nombre) faltan.push(campos.nombre);
      if (!mensaje) faltan.push(campos.mensaje);
      [campos.nombre, campos.mensaje].forEach((c) => {
        if (faltan.includes(c)) c.setAttribute("aria-invalid", "true"); else c.removeAttribute("aria-invalid");
      });
      if (faltan.length) {
        nota.textContent = faltan.length === 2 ? "Escribe tu nombre y el mensaje." : !nombre ? "Falta tu nombre." : "Falta el mensaje.";
        nota.classList.add("error");
        faltan[0].focus();
        return;
      }
      nota.classList.remove("error");
      const asunto = `${motivo} · ${nombre}`;
      const cuerpo = `${mensaje}\n\n${nombre}`;
      window.location.href = `mailto:lalo3102000@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
      nota.textContent = "Se abre tu programa de correo con el mensaje listo. Si no se abre, escríbeme a lalo3102000@gmail.com.";
      setTimeout(() => { if (!nota.classList.contains("error")) nota.textContent = notaInicial; }, 12000);
    });
  }

  /* ------------------------------------- Estado de las demos (en vivo)
     Las demos están en el plan gratuito de Render: se duermen tras 15
     minutos sin visitas y tardan un minuto en arrancar. Al abrir la página
     se pregunta a /api/health de cada una; la misma luz sale en el panel
     de la portada y en el botón de cada proyecto:
     gris (sin comprobar), ámbar (arrancando), verde (en línea), roja (no responde). */
  const ESPERA_MAXIMA = 150000;
  const normal = (url) => url.replace(/\/+$/, "");
  const demos = $$(".estado-fila[data-demo]").map((fila) => {
    const url = normal(fila.dataset.demo);
    const boton = $$("a[data-demo]").find((a) => normal(a.href) === url) || null;
    return {
      url, fila, boton,
      valor: $(".estado-valor", fila),
      texto: boton && $(".boton-demo-texto", boton),
      nota: boton && $(".nota-demo", boton.closest(".proyecto-texto")),
      estado: "", inicio: 0, ms: 0,
    };
  });
  const resumen = $("#estado-resumen");

  function pintarResumen() {
    const enLinea = demos.filter((d) => d.estado === "lista").length;
    const pendientes = demos.filter((d) => d.estado === "comprobando" || d.estado === "despertando").length;
    if (!demos.some((d) => d.estado)) resumen.textContent = "Sin comprobar";
    else if (pendientes) resumen.textContent = `${enLinea} de ${demos.length} en línea · comprobando`;
    else resumen.textContent = `${enLinea} de ${demos.length} en línea`;
  }

  function pintar(demo, estado) {
    const cambio = demo.estado !== estado;
    demo.estado = estado;
    demo.fila.dataset.estado = estado;
    if (demo.boton) demo.boton.dataset.estado = estado;
    const segundos = Math.max(1, Math.round((Date.now() - demo.inicio) / 1000));

    if (estado === "comprobando") demo.valor.textContent = "comprobando…";
    else if (estado === "despertando") demo.valor.textContent = `arrancando · ${segundos} s`;
    else if (estado === "lista") demo.valor.textContent = `en línea · ${demo.ms} ms`;
    else if (estado === "error") demo.valor.textContent = "no responde";

    if (demo.texto) demo.texto.textContent = estado === "despertando" ? `Arrancando… ${segundos} s` : "Probar la demo";
    if (demo.nota && cambio) {
      if (estado === "despertando") demo.nota.textContent = "Estaba en reposo (servidor gratuito). Tarda hasta un minuto; puedes abrirla ya y esperar allí.";
      else if (estado === "lista") demo.nota.textContent = "En línea. Dentro tienes las cuentas de prueba para entrar con un clic.";
      else if (estado === "error") demo.nota.textContent = "Ahora mismo no responde. Ábrela igualmente y, si no carga, prueba en un rato.";
    }
    if (cambio) pintarResumen();
  }

  async function consultar(demo, ms) {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), ms);
    const t0 = performance.now();
    try {
      const r = await fetch(`${demo.url}/api/health`, { mode: "cors", cache: "no-store", signal: control.signal });
      if (!r.ok) return false;
      const datos = await r.json();
      demo.ms = Math.round(performance.now() - t0);
      return datos && datos.status === "ok";
    } catch (_) {
      return false;
    } finally {
      clearTimeout(reloj);
    }
  }

  async function comprobar(demo) {
    if (demo.estado === "comprobando" || demo.estado === "despertando") return;
    demo.inicio = Date.now();
    pintar(demo, "comprobando");
    // Si ya estaba en marcha, contesta enseguida.
    if (await consultar(demo, 3000)) return pintar(demo, "lista");
    pintar(demo, "despertando");
    const contador = setInterval(() => { if (demo.estado === "despertando") pintar(demo, "despertando"); }, 1000);
    while (Date.now() - demo.inicio < ESPERA_MAXIMA) {
      if (await consultar(demo, 20000)) {
        clearInterval(contador);
        // Recién arrancada, la primera respuesta es lenta: se mide otra vez.
        await consultar(demo, 5000);
        return pintar(demo, "lista");
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
    clearInterval(contador);
    pintar(demo, "error");
  }

  if (demos.length && location.protocol.startsWith("http")) {
    // Las cuatro a la vez, con un pequeño escalonado para que se vea fila a fila.
    demos.forEach((demo, i) => setTimeout(() => comprobar(demo), reducido ? 0 : 250 + i * 180));
    // Si una falló, al pasar por su botón se vuelve a intentar.
    for (const demo of demos) {
      if (!demo.boton) continue;
      const otraVez = () => { if (demo.estado === "error") comprobar(demo); };
      demo.boton.addEventListener("pointerenter", otraVez);
      demo.boton.addEventListener("focus", otraVez);
    }
  }
})();
