const container = document.getElementById("contenedor-tarjetas");
const scrollBtn = document.getElementById("scroll-top-btn");
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;
let frases = [];
let index = 0;

// Alternar modo claro/oscuro
themeBtn.onclick = () => {
    const current = body.getAttribute("data-theme");
    body.setAttribute("data-theme", current === "light" ? "dark" : "light");
};

// Botón scroll arriba
window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Cargar mensajes desde JSON
async function cargarMensajes() {
    const res = await fetch("mensajes.json");
    frases = await res.json();
    cargarTarjetas();
}

// Crear tarjetas con botones organizados
function cargarTarjetas() {
    const limit = frases.length;
    for (; index < limit; index++) {
        const { color, futuro, espanol, url } = frases[index];
        const card = document.createElement("div");
        card.className = "card";
        card.style.borderColor = color;

        // Español
        const spanEspanol = document.createElement("span");
        spanEspanol.textContent = espanol;
        spanEspanol.setAttribute("aria-label", "Mensaje en español");

        // Futuro
        const spanFuturo = document.createElement("span");
        spanFuturo.setAttribute("aria-label", "Mensaje del futuro");

        const textoFuturo = document.createElement("div");
        textoFuturo.textContent = futuro;

        // Botón de descarga
        const botonDescargar = document.createElement("button");
        botonDescargar.textContent = "¿📥 + compartir?";
        botonDescargar.className = "boton-relato";
        botonDescargar.onclick = () => {
            descargarComoImagen(card, color);
        };

        // Botón de relato
        const botonRelato = document.createElement("button");
        botonRelato.textContent = "🚀 Ir a qu-relato";
        botonRelato.className = "boton-relato";
        botonRelato.onclick = () => {
            window.location.href = url;
        };

        // Contenedor de botones
        const botonesContainer = document.createElement("div");
        botonesContainer.className = "botones-relato";
        botonesContainer.appendChild(botonDescargar);
        botonesContainer.appendChild(botonRelato);

        spanFuturo.append(textoFuturo, botonesContainer);
        card.append(spanEspanol, spanFuturo);
        container.appendChild(card);
    }
}

// Descargar tarjeta como imagen con marca de agua y centrado
function descargarComoImagen(cardElement, color) {
    // Clonar la tarjeta
    const clone = cardElement.cloneNode(true);

    // Eliminar botones del clon
    clone.querySelectorAll("button").forEach(btn => btn.remove());

    // Añadir marca de agua
    const marcaAgua = document.createElement("div");
    marcaAgua.textContent = "#robotsideas.com";
    marcaAgua.style.marginTop = "1rem";
    marcaAgua.style.fontSize = "0.9rem";
    marcaAgua.style.fontWeight = "bold";
    marcaAgua.style.textAlign = "center";
    marcaAgua.style.opacity = "0.7";
    clone.appendChild(marcaAgua);

    // Aplicar estilos de centrado al clon
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.width = "300px";
    clone.style.padding = "1rem";
    clone.style.border = "5px solid " + color;
    clone.style.borderRadius = "12px";
    clone.style.backgroundColor = getComputedStyle(cardElement).backgroundColor;
    clone.style.display = "flex";
    clone.style.flexDirection = "column";
    clone.style.alignItems = "center";
    clone.style.justifyContent = "center";
    clone.style.textAlign = "center";

    // Insertar el clon en el DOM temporalmente
    document.body.appendChild(clone);

    html2canvas(clone).then(canvas => {
        const link = document.createElement("a");
        link.download = "mensaje-del-futuro.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.92);
        link.click();
        document.body.removeChild(clone);
    });
}

// Cargar librería html2canvas
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
script.onload = cargarMensajes;
document.head.appendChild(script);

