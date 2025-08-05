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
        case 'facebook':
            url = 'https://www.facebook.com/robotsideas';
            break;
        case 'telegram':
            url = 'https://t.me/+bvSrkugztNZhOWY0';
            break;
        case 'youtube':
            url = 'https://www.youtube.com/@robotsideas';
            break;
        case 'instagram':
            url = 'https://www.instagram.com/robotsideas';
            break;
        case 'tiktok':
            url = 'https://www.tiktok.com/@robotsideas';
            break;
        default:
            alert('Red no soportada');
            return;
    }

    window.open(url, '_blank');
}
