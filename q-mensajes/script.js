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
    scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
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

// Función para dibujar rectángulos redondeados
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Función para calcular altura del texto
function calculateTextHeight(ctx, text, maxWidth, lineHeight) {
    const words = text.split(' ');
    let lines = 0;
    let currentLine = '';
    
    for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines++;
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    return (lines + 1) * lineHeight;
}

// Función para envolver texto
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

// Descargar tarjeta como imagen usando Canvas
function descargarComoImagen(cardElement, color) {
    // Obtener textos
    const espanol = cardElement.querySelector('span[aria-label="Mensaje en español"]').textContent;
    const futuro = cardElement.querySelector('span[aria-label="Mensaje del futuro"] > div').textContent;
    
    // Configuración inicial
    const padding = 20;
    const fontSize = 16;
    const lineHeight = 22;
    const borderWidth = 5;
    const cornerRadius = 12;
    const cardWidth = 300;
    const maxWidth = cardWidth - 2 * padding;
    
    // Crear canvas temporal para calcular altura
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = cardWidth;
    
    // Configurar fuentes
    const fontNormal = `${fontSize}px 'Comic Sans MS', 'Kristen ITC', 'Chalkboard SE', 'Noteworthy', 'Marker Felt', 'Ink Free', Arial, Verdana, sans-serif`;
    const fontBold = `bold ${fontSize}px 'Comic Sans MS', 'Kristen ITC', 'Chalkboard SE', 'Noteworthy', 'Marker Felt', 'Ink Free', Arial, Verdana, sans-serif`;
    
    // Calcular altura necesaria
    tempCtx.font = fontBold;
    const espanolHeight = calculateTextHeight(tempCtx, espanol, maxWidth, lineHeight);
    
    tempCtx.font = fontNormal;
    const futuroHeight = calculateTextHeight(tempCtx, futuro, maxWidth, lineHeight);
    
    const watermarkHeight = lineHeight;
    const totalHeight = padding * 2 + espanolHeight + futuroHeight + watermarkHeight;
    
    // Crear canvas definitivo
    const canvas = document.createElement('canvas');
    canvas.width = cardWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');
    
    // Obtener colores de la tarjeta
    const bgColor = window.getComputedStyle(cardElement).backgroundColor;
    const textColor = window.getComputedStyle(cardElement).color;
    
    // Dibujar fondo
    ctx.fillStyle = bgColor;
    roundRect(ctx, 0, 0, cardWidth, totalHeight, cornerRadius);
    ctx.fill();
    
    // Dibujar borde
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    roundRect(ctx, 0, 0, cardWidth, totalHeight, cornerRadius);
    ctx.stroke();
    
    // Configurar texto
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = textColor;
    
    let yPos = padding;
    
    // Dibujar texto en español
    ctx.font = fontBold;
    yPos = wrapText(ctx, espanol, cardWidth / 2, yPos, maxWidth, lineHeight);
    
    // Dibujar texto del futuro
    ctx.font = fontNormal;
    yPos = wrapText(ctx, futuro, cardWidth / 2, yPos, maxWidth, lineHeight);
    
    // Dibujar marca de agua
    ctx.font = `bold 12px 'Comic Sans MS', 'Kristen ITC', 'Chalkboard SE', 'Noteworthy', 'Marker Felt', 'Ink Free', Arial, Verdana, sans-serif`;
    ctx.globalAlpha = 0.7;
    ctx.fillText('#robotsideas.com', cardWidth / 2, yPos);
    ctx.globalAlpha = 1.0;
    
    // Convertir a imagen y descargar
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'mensaje-del-futuro.jpg';
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.92);
}

// Iniciar carga de mensajes
cargarMensajes();