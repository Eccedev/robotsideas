document.addEventListener('DOMContentLoaded', () => {
    // Aumentar/Disminuir tamaño de fuente (ejemplo)
    const body = document.body;
    let currentFontSize = 16; // Tamaño de fuente base en px

    function adjustFontSize(factor) {
        currentFontSize += factor;
        if (currentFontSize < 12) currentFontSize = 12; // Mínimo
        if (currentFontSize > 24) currentFontSize = 24; // Máximo
        body.style.fontSize = `${currentFontSize}px`;
    }

    // Puedes añadir botones para esto en tu interfaz si lo deseas, por ejemplo:
    // <button id="increase-font" aria-label="Aumentar tamaño de fuente">A+</button>
    // <button id="decrease-font" aria-label="Disminuir tamaño de fuente">A-</button>
    // document.getElementById('increase-font')?.addEventListener('click', () => adjustFontSize(2));
    // document.getElementById('decrease-font')?.addEventListener('click', () => adjustFontSize(-2));

    // Mejoras de enfoque para navegación por teclado (ya implícito con botones/enlaces estándar)
    // Asegúrate de que los elementos interactivos personalizados tengan tabindex="0" si no son botones/enlaces

    // Live regions para actualizaciones dinámicas (ejemplo: comic-section en index.html)
    // El atributo aria-live="polite" en <section id="comic-section"> ya ayuda a que los lectores de pantalla
    // anuncien los cambios en el contenido de esa sección de manera no intrusiva.

    // Puedes añadir más funcionalidades específicas si identificas áreas problemáticas
    // Por ejemplo, manejo de focus para modales, etc.
});