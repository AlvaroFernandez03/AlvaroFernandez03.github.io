# Cómo publicarlo todo

Son tres partes y se hacen una sola vez (unos 30 minutos en total):

1. **Subir los 5 proyectos a GitHub** con GitHub Desktop.
2. **Encender las 4 demos en Render** (gratis), de una vez, con el `render.yaml`.
3. **Comprobar** que el portfolio y las demos funcionan.

Después, cada cambio que hagas en un proyecto se publica solo al subirlo a
GitHub (Commit + Push en GitHub Desktop).

---

## 1. Subir los proyectos a GitHub

Las 5 carpetas están en el Escritorio. Los nombres en GitHub tienen que ser
**exactamente** estos, porque el portfolio y el `render.yaml` los usan:

| Carpeta del Escritorio | Nombre del repositorio en GitHub |
|---|---|
| `academia` | `academiaapp` |
| `tienda` | `atelier` |
| `ofitrack` | `ofitrack` |
| `gym-website` | `powergym` |
| `portfolio` | `AlvaroFernandez03.github.io` |

Repite esto con cada carpeta (empieza por las cuatro apps y deja el portfolio
para el final):

1. Abre **GitHub Desktop** e inicia sesión con tu cuenta (`AlvaroFernandez03`)
   si no lo has hecho ya.
2. **File → Add local repository…** → **Choose…** y elige la carpeta.
3. Saldrá el aviso *"This directory does not appear to be a Git repository"*.
   Pulsa el enlace **"create a repository"**.
4. En la ventana que se abre **no cambies el nombre** (deja el de la carpeta),
   deja *Git ignore* en **None** (cada proyecto ya trae su `.gitignore`) y
   pulsa **Create repository**.
5. En la pestaña **Changes**, echa un vistazo a la lista: **no** deben
   aparecer `.env`, `node_modules` ni archivos `.db` (el `.gitignore` los
   deja fuera; el `.env` lleva tus claves y no debe subirse nunca). Si
   aparece alguno, para y avísame.
6. Abajo a la izquierda, en *Summary*, escribe `Primera versión` y pulsa
   **Commit to main**.
7. Arriba, **Publish repository**:
   - **Name**: el de la tabla de arriba (aquí es donde se cambia).
   - **Desmarca "Keep this code private"**: el código tiene que ser público
     para que lo vean las empresas y para que GitHub Pages publique el portfolio.
   - Pulsa **Publish repository**.

### Activar la web del portfolio (GitHub Pages)

Con el repositorio `AlvaroFernandez03.github.io` ya publicado:

1. Ábrelo en github.com (en GitHub Desktop: **Repository → View on GitHub**).
2. **Settings → Pages**.
3. En *Build and deployment*: **Source: Deploy from a branch**, **Branch:
   main** y carpeta **/ (root)** → **Save**.
4. En uno o dos minutos la web está en **https://alvarofernandez03.github.io/**
   (arriba, en esa misma página de *Pages*, aparece el enlace cuando está lista).

---

## 2. Encender las demos en Render

Render pone en marcha las cuatro apps a la vez leyendo el archivo
`render.yaml` del portfolio. No hay que configurar nada a mano: la clave
`JWT_SECRET` de cada app la genera Render y no hay que poner ninguna más.

1. Entra en **https://render.com** → **Get Started** → **GitHub** (regístrate
   con tu cuenta de GitHub).
2. Cuando Render pida acceso a GitHub, en *Repository access* elige **All
   repositories**, o **Only select repositories** y marca los cinco:
   `academiaapp`, `atelier`, `ofitrack`, `powergym` y
   `AlvaroFernandez03.github.io`.
3. En el panel de Render: **New → Blueprint**.
4. Elige el repositorio **`AlvaroFernandez03.github.io`**. Como nombre del
   Blueprint pon, por ejemplo, `demos-portfolio`.
5. Render enseña los cuatro servicios que va a crear (`alvarofo-academia`,
   `alvarofo-atelier`, `alvarofo-ofitrack` y `alvarofo-powergym`), todos con
   el plan **Free**. Pulsa **Deploy Blueprint** (o **Apply**).
6. Espera a que los cuatro pasen a **Live** (la primera vez tarda unos minutos
   cada uno, porque instala las dependencias).

### Muy importante: comprueba las direcciones

Abre cada servicio en Render y mira su dirección (arriba, debajo del nombre).
Lo normal es que sean estas:

- https://alvarofo-academia.onrender.com
- https://alvarofo-atelier.onrender.com
- https://alvarofo-ofitrack.onrender.com
- https://alvarofo-powergym.onrender.com

Si alguna es distinta (Render añade letras al final si el nombre ya estaba
cogido, por ejemplo `alvarofo-atelier-x7k2.onrender.com`), **dímelo** y lo
cambio en el portfolio, en el `render.yaml` y en el README de esa app.

---

## 3. Comprobar que todo funciona

1. Abre **https://alvarofernandez03.github.io/** y baja hasta los proyectos.
   La luz de cada botón **Probar la demo** se pone amarilla mientras la demo
   despierta y **verde** cuando está lista.
2. Entra en cada demo: abajo a la izquierda sale la cinta **Demo** con las
   cuentas de prueba. Pulsa **Entrar →** en una y debe entrar sola.
3. Prueba el formulario de contacto: abre tu programa de correo con el
   mensaje preparado para `lalo3102000@gmail.com`.
4. Pega el enlace del portfolio en WhatsApp o LinkedIn: debe salir la vista
   previa con la imagen de las piezas sobre el tapete.

## Bueno saber

- **Plan gratuito de Render**: cada demo se duerme tras 15 minutos sin
  visitas y tarda alrededor de un minuto en despertar. Al despertar, sus datos
  vuelven a ser los de ejemplo (por eso no se puede "romper"). Tienes 750 horas
  gratis al mes entre todos los servicios: de sobra, porque solo cuentan
  mientras están despiertas.
- **Para actualizar** una app o el portfolio: cambia los archivos, y en GitHub
  Desktop **Commit to main** + **Push origin**. GitHub Pages y Render se
  actualizan solos en unos minutos.
- **Tus `.env` no se suben nunca** (están en el `.gitignore`), y las demos no
  los necesitan.
- Si algún día quieres un dominio propio (`alvarofernandez.es`, por ejemplo),
  se puede apuntar al portfolio desde *Settings → Pages → Custom domain*.
