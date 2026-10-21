// Portfolio de Álvaro Fernández Ortuño — interacción de la página.
// Sin librerías: menú del móvil, aparición al bajar, galería de capturas,
// copiar el email, el formulario (prepara un email) y la luz de cada demo,
// que despierta su servidor mientras lees.
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
        if (enlace && e.isIntersecting) {
          enlacesMenu.forEach((a) => { a.classList.remove("activo"); a.removeAttribute("aria-current"); });
          enlace.classList.add("activo");
          enlace.setAttribute("aria-current", "true");
        }
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    enlacesMenu.forEach((_, id) => { const s = document.getElementById(id); if (s) vistaSeccion.observe(s); });
  }

  /* ---------------------------------------------- Aparecer al bajar */
  const aparecen = $$(".aparece");
  const mostrar = (el) => {
    el.classList.add("visto");
    // Terminada la entrada, cada pieza recupera sus propias transiciones (hover...).
    if (!el.classList.contains("proyecto")) setTimeout(() => el.classList.remove("aparece"), 1400);
  };
  if ("IntersectionObserver" in window && !reducido) {
    const vista = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) { mostrar(e.target); vista.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    aparecen.forEach((el) => vista.observe(el));
  } else {
    aparecen.forEach(mostrar);
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
      const listo = nueva.decode ? nueva.decode().catch(() => {}) : Promise.resolve();
      Promise.all([listo, new Promise((r) => setTimeout(r, reducido ? 0 : 180))]).then(() => {
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
      boton.textContent = ok ? "¡Copiado!" : "Cópialo a mano";
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

  /* ------------------------------------------------- Luz de las demos
     Las demos están en el plan gratuito de Render: se duermen tras 15 minutos
     sin visitas y tardan un minuto en despertar. Cuando un proyecto se acerca
     a la pantalla, se llama a su /api/health para despertarlo y la luz dice
     cómo va: gris (sin mirar), amarilla (despertando), verde (lista). */
  const ESPERA_MAXIMA = 150000;
  const demos = $$("a[data-demo]").map((boton) => ({
    boton,
    url: boton.href.replace(/\/+$/, ""),
    texto: $(".boton-demo-texto", boton),
    nota: $(".nota-demo", boton.closest(".proyecto-texto")),
    estado: "",
    inicio: 0,
  }));

  function pintar(demo, estado) {
    demo.estado = estado;
    demo.boton.dataset.estado = estado;
    const segundos = Math.max(1, Math.round((Date.now() - demo.inicio) / 1000));
    if (estado === "despertando") {
      demo.texto.textContent = `Despertando… ${segundos} s`;
      if (!demo.nota.textContent) {
        demo.nota.textContent = "Estaba dormida (servidor gratuito). Tarda hasta un minuto; puedes abrirla ya y esperar allí.";
      }
    } else if (estado === "lista") {
      demo.texto.textContent = "Probar la demo";
      demo.nota.textContent = "Lista. Dentro tienes las cuentas de prueba para entrar con un clic.";
    } else if (estado === "error") {
      demo.texto.textContent = "Probar la demo";
      demo.nota.textContent = "Está tardando más de lo normal. Ábrela igualmente y, si no carga, prueba en un rato.";
    }
  }

  async function responde(url, ms) {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), ms);
    try {
      const r = await fetch(`${url}/api/health`, { mode: "cors", cache: "no-store", signal: control.signal });
      if (!r.ok) return false;
      const datos = await r.json();
      return datos && datos.status === "ok";
    } catch (_) {
      return false;
    } finally {
      clearTimeout(reloj);
    }
  }

  async function despertar(demo) {
    if (demo.estado) return;
    demo.estado = "comprobando";
    demo.inicio = Date.now();
    // Si ya estaba despierta, contesta enseguida y no hace falta enseñar nada más.
    if (await responde(demo.url, 2500)) return pintar(demo, "lista");
    pintar(demo, "despertando");
    const contador = setInterval(() => { if (demo.estado === "despertando") pintar(demo, "despertando"); }, 1000);
    while (Date.now() - demo.inicio < ESPERA_MAXIMA) {
      if (await responde(demo.url, 20000)) { clearInterval(contador); return pintar(demo, "lista"); }
      await new Promise((r) => setTimeout(r, 3000));
    }
    clearInterval(contador);
    pintar(demo, "error");
  }

  if (demos.length && location.protocol.startsWith("http")) {
    for (const demo of demos) {
      demo.boton.addEventListener("pointerenter", () => despertar(demo), { once: true });
      demo.boton.addEventListener("focus", () => despertar(demo), { once: true });
    }
    if ("IntersectionObserver" in window) {
      const cerca = new IntersectionObserver((entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const demo = demos.find((d) => e.target.contains(d.boton));
          if (demo) despertar(demo);
          cerca.unobserve(e.target);
        }
      }, { rootMargin: "300px 0px" });
      demos.forEach((d) => cerca.observe(d.boton.closest(".proyecto")));
    } else {
      demos.forEach(despertar);
    }
  }
})();
