// === Scroll to Top ===
const scrollToTopButton = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// === Light/Dark Mode Toggle ===
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Cargar tema guardado
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'dark') {
    body.classList.add('dark');
} else {
    body.classList.remove('dark');
}

function updateToggleButton() {
    if (body.classList.contains('dark')) {
        toggleButton.innerHTML = '&#9680;'; // Sol
    } else {
        toggleButton.innerHTML = '&#9681;'; // Luna
    }
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark');
    const theme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateToggleButton();
});

updateToggleButton();


function redirigir(red) {
    let url = '';

    switch (red) {
        case 'twitter':
            url = 'https://x.com/robotsideas';
            break;
        case 'telegram':
            url = 'https://t.me/robotsideas';
            break;
            case 'bluesky':
            url = 'https://bsky.app/profile/robotsideas.bsky.social';
            break;
        //case 'youtube':
          //  url = 'https://www.youtube.com/@robotsideas.com-youtube';
            //break;
        default:
            alert('Red no soportada');
            return;
    }

    window.open(url, '_blank');
}
