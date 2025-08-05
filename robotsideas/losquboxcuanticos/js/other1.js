document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos para Archive Functionality (existentes) ---
    const comicsListContainer = document.getElementById('comics-list');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');
    const sortBy = document.getElementById('sort-by');

    // --- Elementos para funcionalidades adicionales ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // --- Variables para compartir ---
    const comicUrl = encodeURIComponent(window.location.href); // URL actual
    const shareText = encodeURIComponent("¡Sonríete con Robotsideas.com!"); // Texto personalizado

    // --- Elementos para el menú de hamburguesa (NUEVO) ---
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('ul li a, ul li#dark-mode-toggle'); // Seleccionar enlaces y el botón de modo oscuro

    

    // --- State Variables (existentes) ---
    let allComics = [];
    // let filteredComics = []; // No parece usarse globalmente, se maneja dentro de applyFiltersAndSort

    // --- Carga de Cómics y Configuración de Filtros (existente) ---
    async function fetchComicsAndSetupFilters() {
        try {
            const response = await fetch('data/comics.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comics = await response.json();
            allComics = comics; // Almacena todos los cómics
            populateFilters(); // Rellenar los filtros antes de aplicar
            applyFiltersAndSort(); // Aplicar filtros y mostrar cómics iniciales
        } catch (error) {
            console.error('Error al cargar los cómics:', error);
            if (comicsListContainer) {
                comicsListContainer.innerHTML = '<p>Error al cargar los cómics. Por favor, inténtalo de nuevo más tarde.</p>';
            }
        }
    }

    // --- Funcionalidad de Mostrar Cómics (existente) ---
    function displayComics(comicsToDisplay) {
        if (!comicsListContainer) return; // Asegúrate de que el contenedor exista

        comicsListContainer.innerHTML = ''; // Limpiar lista existente
        if (comicsToDisplay.length === 0) {
            comicsListContainer.innerHTML = '<p>No se encontraron cómics que coincidan con los criterios de búsqueda.</p>';
            return;
        }

        comicsToDisplay.forEach(comic => {
            const comicCard = document.createElement('div');
            comicCard.classList.add('comic-card');

            const comicLink = document.createElement('a');
            comicLink.href = `index.html?comicId=${comic.id}`; // Enlace a la página principal con el cómic
            comicLink.setAttribute('aria-label', `Ver cómic ${comic.title}`);

            const comicImage = document.createElement('img');
            comicImage.src = comic.thumbnail; // Usar thumbnail para la vista de archivo
            comicImage.alt = comic.alt_text;
            comicImage.loading = 'lazy'; // Carga lazy para imágenes

            const comicTitle = document.createElement('h3');
            comicTitle.textContent = comic.title;

            const comicDate = document.createElement('p');
            comicDate.textContent = new Date(comic.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const comicTagsContainer = document.createElement('div');
            comicTagsContainer.classList.add('card-tags');
            if (comic.tags && comic.tags.length > 0) {
                comic.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.textContent = tag;
                    comicTagsContainer.appendChild(span);
                });
            }

            comicLink.appendChild(comicImage);
            comicLink.appendChild(comicTitle);
            comicLink.appendChild(comicDate);

            comicCard.appendChild(comicLink);
            comicCard.appendChild(comicTagsContainer); // Añadir tags directamente a la tarjeta
            comicsListContainer.appendChild(comicCard);
        });
    }

    // --- Funcionalidad de Filtros y Ordenamiento (existente) ---
    function populateFilters() {
        if (!allComics.length) return;

        const categories = new Set();
        const tags = new Set();

        allComics.forEach(comic => {
            if (comic.categories) {
                comic.categories.forEach(cat => categories.add(cat));
            }
            if (comic.tags) {
                comic.tags.forEach(tag => tags.add(tag));
            }
        });

        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });
        }

        if (tagFilter) {
            tagFilter.innerHTML = '<option value="">Todas las etiquetas</option>';
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagFilter.appendChild(option);
            });
        }
    }

    function applyFiltersAndSort() {
        let filtered = [...allComics]; // Copia de los cómics originales

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        const selectedTag = tagFilter ? tagFilter.value : '';
        const selectedSortBy = sortBy ? sortBy.value : 'date-desc'; // Default sort

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(comic =>
                comic.title.toLowerCase().includes(searchTerm) ||
                comic.alt_text.toLowerCase().includes(searchTerm) ||
                comic.explanation.toLowerCase().includes(searchTerm) ||
                (comic.tags && comic.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
                (comic.categories && comic.categories.some(cat => cat.toLowerCase().includes(searchTerm)))
            );
        }

        // Filtrar por categoría
        if (selectedCategory) {
            filtered = filtered.filter(comic =>
                comic.categories && comic.categories.includes(selectedCategory)
            );
        }

        // Filtrar por etiqueta
        if (selectedTag) {
            filtered = filtered.filter(comic =>
                comic.tags && comic.tags.includes(selectedTag)
            );
        }

        // Ordenar
        if (selectedSortBy) {
            filtered.sort((a, b) => {
                switch (selectedSortBy) {
                    case 'date-desc': // Más reciente primero
                        return new Date(b.date) - new Date(a.date);
                    case 'date-asc': // Más antiguo primero
                        return new Date(a.date) - new Date(b.date);
                    case 'title-asc': // Título A-Z
                        return a.title.localeCompare(b.title);
                    case 'title-desc': // Título Z-A
                        return b.title.localeCompare(a.title);
                    case 'views-desc': // Vistas (mayor a menor)
                        return (b.views || 0) - (a.views || 0);
                    case 'rating-desc': // Rating (mayor a menor)
                        return (b.rating || 0) - (a.rating || 0);
                    default:
                        return 0;
                }
            });
        }

        displayComics(filtered);
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
            if (window.scrollY > 100) { // Muestra el botón después de desplazar 200px
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


    // --- Event Listeners para Filtros y Ordenamiento (con verificaciones) ---
    if (searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFiltersAndSort);
    if (tagFilter) tagFilter.addEventListener('change', applyFiltersAndSort);
    if (sortBy) sortBy.addEventListener('change', applyFiltersAndSort);

    // --- Inicialización ---
    fetchComicsAndSetupFilters(); // Carga cómics y configura filtros
    setupHamburgerMenu(); // Llama a la función para configurar el menú al cargar la página
});



