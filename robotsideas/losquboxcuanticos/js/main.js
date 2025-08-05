document.addEventListener('DOMContentLoaded', () => {
    const comicImage = document.getElementById('comic-image');
    const comicTitle = document.getElementById('comic-title');
    const comicDate = document.getElementById('comic-date');
    const comicExplanation = document.getElementById('comic-explanation');
    const altTextTooltip = document.getElementById('alt-text-tooltip');
    const comicTagsContainer = document.getElementById('comic-tags');

    const prevComicBtn = document.getElementById('prev-comic');
    const nextComicBtn = document.getElementById('next-comic');
    const firstComicBtn = document.getElementById('first-comic');
    const lastComicBtn = document.getElementById('last-comic');
    const randomComicBtn = document.getElementById('random-comic');

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // --- Elementos para el menú de hamburguesa (NUEVO) ---
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('ul li a, ul li#dark-mode-toggle'); // Seleccionar enlaces y el botón de modo oscuro

    let allComics = [];
    let currentComicIndex = 0;

    // --- Funcionalidad de Carga de Cómics ---
    async function fetchComics() {
        try {
            const response = await fetch('data/comics.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comics = await response.json();
            allComics = comics.sort((a, b) => b.id - a.id); // Ordenar por ID descendente
            // Si no hay un cómicId en la URL, mostrar el último cómic añadido
            if (!urlParams.get('comicId')) {
                currentComicIndex = 0; // El cómic más reciente es el primero después de ordenar
            }
            displayComic(currentComicIndex);// Configurar botones de compartir una vez que haya cómics
        } catch (error) {
            console.error('Error al cargar los cómics:', error);
            comicImage.alt = 'Error al cargar el cómic.';
            comicTitle.textContent = 'Error al cargar el cómic.';
            comicExplanation.textContent = 'Por favor, inténtalo de nuevo más tarde.';
        }
    }

    function displayComic(index) {
        if (allComics.length === 0) return;

        const comic = allComics[index];
        comicImage.src = comic.image;
        comicImage.alt = comic.alt_text;
        comicTitle.textContent = comic.title;
        comicDate.textContent = new Date(comic.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        comicExplanation.textContent = comic.explanation;

        // Mostrar tags
        comicTagsContainer.innerHTML = '';
        if (comic.tags && comic.tags.length > 0) {
            comic.tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                comicTagsContainer.appendChild(span);
            });
        }

        // Actualizar URL sin recargar la página
        const newUrl = `${window.location.origin}${window.location.pathname}?comicId=${comic.id}`;
        window.history.pushState({
            path: newUrl
        }, '', newUrl);

        currentComicIndex = index; // Actualizar el índice actual
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        firstComicBtn.disabled = (currentComicIndex === allComics.length - 1);
        prevComicBtn.disabled = (currentComicIndex === allComics.length - 1);
        nextComicBtn.disabled = (currentComicIndex === 0);
        lastComicBtn.disabled = (currentComicIndex === 0);
    }


    function navigateComic(direction) {
        let newIndex = currentComicIndex;
        if (direction === 'next') {
            newIndex--;
            if (newIndex < 0) newIndex = 0; // Evitar ir más allá del primer cómic
        } else if (direction === 'prev') {
            newIndex++;
            if (newIndex >= allComics.length) newIndex = allComics.length - 1; // Evitar ir más allá del último cómic
        } else if (direction === 'first') {
            newIndex = allComics.length - 1; // Primer cómic (el más antiguo)
        } else if (direction === 'last') {
            newIndex = 0; // Último cómic (el más reciente)
        } else if (direction === 'random') {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * allComics.length);
            } while (randomIndex === currentComicIndex && allComics.length > 1); // Evita el mismo cómic si hay más de uno
            newIndex = randomIndex;
        }

        if (newIndex !== currentComicIndex) {
            displayComic(newIndex);
        }
    }

    // --- Dark Mode Toggle (EXISTENTE) ---
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            // Actualizar el texto del botón al cambiar el modo
            darkModeToggle.textContent = isDarkMode ? 'claro' : 'oscuro';
        });

        // Aplicar modo oscuro al cargar la página si está guardado
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = 'claro'; // Asegura que el texto sea 'claro' si el modo oscuro está activo
        } else {
            darkModeToggle.textContent = 'oscuro'; // Asegura que el texto sea 'oscuro' si el modo claro está activo
        }
    }

    // --- Scroll to Top Button (EXISTENTE) ---
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) { // Muestra el botón después de desplazar 100px
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    

    // --- Funcionalidad del Menú de Hamburguesa (NUEVO) ---
    function setupHamburgerMenu() {
        if (openMenuBtn && closeMenuBtn && mainNav) {
            openMenuBtn.addEventListener('click', () => {
                mainNav.classList.add('active'); // Muestra el menú
                openMenuBtn.style.display = 'none'; // Oculta el botón '+'
                closeMenuBtn.style.display = 'block'; // Muestra el botón '-'
                // Opcional: Para accesibilidad, puedes mover el foco al primer elemento del menú
                // mainNav.querySelector('ul li a')?.focus();
            });

            closeMenuBtn.addEventListener('click', () => {
                mainNav.classList.remove('active'); // Oculta el menú
                openMenuBtn.style.display = 'block'; // Muestra el botón '+'
                closeMenuBtn.style.display = 'none'; // Oculta el botón '-'
                // Opcional: Para accesibilidad, puedes mover el foco de vuelta al botón '+'
                // openMenuBtn.focus();
            });

            // Cerrar menú al hacer clic en un enlace o en el botón de modo oscuro
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Solo cierra el menú si la pantalla es <= 768px
                    if (window.innerWidth <= 768) {
                        mainNav.classList.remove('active');
                        openMenuBtn.style.display = 'block';
                        closeMenuBtn.style.display = 'none';
                    }
                });
            });

            // Ocultar botones de menú en pantallas grandes al redimensionar
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    mainNav.classList.remove('active'); // Asegura que el menú esté oculto
                    openMenuBtn.style.display = 'none'; // Oculta el '+'
                    closeMenuBtn.style.display = 'none'; // Oculta el '-'
                    // Asegúrate de que la navegación por defecto sea visible en pantallas grandes
                    mainNav.style.display = ''; // Elimina el estilo 'display: none' si se añadió inline
                } else {
                    // En pantallas pequeñas, si el menú no está activo, muestra el '+'
                    if (!mainNav.classList.contains('active')) {
                        openMenuBtn.style.display = 'block';
                        closeMenuBtn.style.display = 'none';
                    }
                }
            });

            // Asegurar el estado inicial al cargar la página en función del tamaño
            if (window.innerWidth > 768) {
                openMenuBtn.style.display = 'none';
                closeMenuBtn.style.display = 'none';
                mainNav.style.display = ''; // Asegura que la navegación esté visible por defecto en escritorio
            } else {
                openMenuBtn.style.display = 'block';
                closeMenuBtn.style.display = 'none';
                mainNav.classList.remove('active'); // Asegura que el menú esté cerrado inicialmente
            }
        }
    }

    // Llama a la función para configurar el menú al cargar la página
    setupHamburgerMenu();

    // --- Event Listeners de Navegación ---
    prevComicBtn.addEventListener('click', () => navigateComic('prev'));
    nextComicBtn.addEventListener('click', () => navigateComic('next'));
    firstComicBtn.addEventListener('click', () => navigateComic('first'));
    lastComicBtn.addEventListener('click', () => navigateComic('last'));
    randomComicBtn.addEventListener('click', () => navigateComic('random'));

    // Cargar cómics al iniciar
    fetchComics();

    // Manejar carga directa de cómic por URL (ej. desde archive.html)
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('comicId');
    if (comicId) {
        // Retrasar la búsqueda hasta que allComics esté cargado
        const checkComicsLoaded = setInterval(() => {
            if (allComics.length > 0) {
                const foundIndex = allComics.findIndex(c => c.id === parseInt(comicId));
                if (foundIndex !== -1) {
                    currentComicIndex = foundIndex;
                    displayComic(currentComicIndex);
                } else {
                    console.warn(`Cómic con ID ${comicId} no encontrado.`);
                    // Volver al último cómic si no se encuentra
                    currentComicIndex = 0;
                    displayComic(currentComicIndex);
                }
                clearInterval(checkComicsLoaded);
            }
        }, 100); // Comprobar cada 100ms
    }
});