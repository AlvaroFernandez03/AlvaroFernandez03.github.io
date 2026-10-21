# Portfolio · Álvaro Fernández Ortuño

Mi web de presentación como desarrollador web: **[alvarofernandez03.github.io](https://alvarofernandez03.github.io/)**

Cuatro aplicaciones completas que se pueden probar en vivo, lo que puedo hacer
para un negocio y mi perfil técnico.

| Proyecto | Qué es | Demo | Código |
|---|---|---|---|
| AcademiaApp | Gestión de una academia de artes marciales: familias, reservas, cuotas | [demo](https://alvarofo-academia.onrender.com) | [academiaapp](https://github.com/AlvaroFernandez03/academiaapp) |
| Atelier | Tienda online de ropa y calzado | [demo](https://alvarofo-atelier.onrender.com) | [atelier](https://github.com/AlvaroFernandez03/atelier) |
| OfiTrack | Control horario y gestión de personal | [demo](https://alvarofo-ofitrack.onrender.com) | [ofitrack](https://github.com/AlvaroFernandez03/ofitrack) |
| PowerGym | Web de un gimnasio con reservas de clases | [demo](https://alvarofo-powergym.onrender.com) | [powergym](https://github.com/AlvaroFernandez03/powergym) |

## Cómo está hecha

HTML, CSS y JavaScript sin librerías ni pasos de compilación. Se publica tal
cual con GitHub Pages.

- **La idea visual** viene de mi oficio, la tapicería: el tapete verde de
  corte con su cuadrícula y su regla, las piezas de patrón con el margen de
  costura discontinuo, las puntadas y la cinta métrica.
- **La luz de cada demo.** Las demos viven en el plan gratuito de Render, que
  las duerme tras un rato sin visitas. Cuando un proyecto se acerca a la
  pantalla, la página llama a su `/api/health` para despertarlo y la luz del
  botón cuenta cómo va: amarilla mientras despierta, verde cuando está lista.
- Las tipografías (Young Serif, Instrument Sans y Martian Mono) van dentro del
  proyecto, así que la página no pide nada a otros servidores.
- Adaptada al móvil, navegable con teclado y respeta «reducir movimiento».

## Archivos

```
index.html          la página
404.html            página de error
css/estilos.css     estilos
js/main.js          menú, galerías, formulario y luz de las demos
fuentes/            tipografías (woff2)
img/                capturas de los proyectos, icono e imagen para redes
render.yaml         las cuatro demos en Render (Blueprint)
PUBLICAR.md         cómo publicar todo, paso a paso
```

Para verla en local basta con abrir `index.html`, o mejor servir la carpeta
(por ejemplo `npx serve .`) para que funcione la luz de las demos.
