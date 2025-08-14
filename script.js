// === Scroll to Top (CORREGIDO) ===
const scrollToTopButton = document.getElementById('scroll-to-top');

// Mostrar/ocultar botón según scroll
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = 'block';
        scrollToTopButton.style.opacity = '1';
    } else {
        scrollToTopButton.style.display = 'none';
        scrollToTopButton.style.opacity = '0';
    }
});

// Evento click para scroll to top (CORREGIDO)
scrollToTopButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// === Light/Dark Mode Toggle (CORREGIDO) ===
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Función para actualizar el botón de tema
function updateToggleButton() {
    const isDark = body.classList.contains('dark');
    
    // Actualizar icono del botón
    toggleButton.textContent = isDark ? '☀' : '☾';
    
    // Actualizar atributos ARIA
    toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggleButton.setAttribute('aria-label', 
        isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
}

// Cargar tema guardado (CORREGIDO)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.remove('dark');
} else {
    body.classList.add('dark');
}

// Inicializar botón de tema al cargar la página
updateToggleButton();

// Evento click para cambiar tema (CORREGIDO)
toggleButton.addEventListener('click', () => {
    // Alternar clase dark
    body.classList.toggle('dark');
    
    // Guardar tema en localStorage
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    // Actualizar botón inmediatamente
    updateToggleButton();
});