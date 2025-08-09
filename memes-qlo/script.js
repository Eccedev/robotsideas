// script.js

// DOM Elements
const memesContainer = document.getElementById('memes-container');
const randomBtn = document.getElementById('random-btn');
const memeOverlay = document.getElementById('meme-overlay');
const expandedMeme = document.getElementById('expanded-meme');
const closeBtn = document.getElementById('close-btn');
const downloadBtn = document.getElementById('download-btn');
const telegramBtn = document.getElementById('telegram-btn');
const twitterBtn = document.getElementById('twitter-btn');
const blueskyBtn = document.getElementById('bluesky-btn'); // nuevo botón
const scrollTopBtn = document.getElementById('scroll-top');
const themeToggle = document.getElementById('theme-toggle');

// Current expanded meme
let currentMeme = null;
let memes = [];

// Fetch memes data
fetch('memes.json')
    .then(response => response.json())
    .then(data => {
        memes = data;
        loadMemes();
    })
    .catch(error => {
        console.error('Error loading memes:', error);
        memes = [
            { id: 1, image: "imgs/1.jpg", title: "Meme 1" },
            { id: 2, image: "imgs/2.jpg", title: "Meme 2" }
        ];
        loadMemes();
    });

// Load memes
function loadMemes() {
    memesContainer.innerHTML = '';
    memes.forEach(meme => {
        const memeElement = document.createElement('div');
        memeElement.className = 'meme-card';
        memeElement.innerHTML = `
            <img src="${meme.image}" alt="${meme.title}" class="meme-circle" data-id="${meme.id}">
            <p class="meme-title">${meme.title}</p>
        `;
        memesContainer.appendChild(memeElement);
    });

    document.querySelectorAll('.meme-circle').forEach(meme => {
        meme.addEventListener('click', () => expandMeme(meme.dataset.id));
    });
}

// Expand meme
function expandMeme(id) {
    currentMeme = memes.find(meme => meme.id == id);
    if (currentMeme) {
        expandedMeme.src = currentMeme.image;
        expandedMeme.alt = currentMeme.title;
        memeOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close expanded meme
function closeMeme() {
    memeOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Download meme
function downloadMeme() {
    if (currentMeme) {
        const link = document.createElement('a');
        link.href = currentMeme.image;
        link.download = `randomeme-${currentMeme.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Share meme
function shareMeme(platform) {
    if (!currentMeme) return;

    const text = `Mira este meme: ${currentMeme.title} - ${window.location.href}`;
    const imageUrl = currentMeme.image;

    switch (platform) {
        case 'telegram':
            window.open(
                `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(text)}`,
                '_blank', 'width=600,height=400,noopener,noreferrer'
            );
            break;
        case 'twitter':
            window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`,
                '_blank', 'width=600,height=400,noopener,noreferrer'
            );
            break;
        case 'bluesky':
            navigator.clipboard.writeText(`${text}\n${imageUrl}`).then(() => {
                alert("📋 Meme copiado al portapapeles. Pega manualmente en Bluesky.\nTe redirijo a tu perfil...");
                window.open('https://bsky.app/profile/robotsideas.bsky.social', '_blank');
            });
            break;
    }
}

// Get random meme
function getRandomMeme() {
    if (memes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memes.length);
    expandMeme(memes[randomIndex].id);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toggle theme
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    themeToggle.setAttribute('aria-checked', isDark);

    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}
}

// Check scroll position
function checkScroll() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            themeToggle.checked = true;
        }
    } catch (e) {}
});

// Event Listeners
randomBtn.addEventListener('click', getRandomMeme);
closeBtn.addEventListener('click', closeMeme);
downloadBtn.addEventListener('click', downloadMeme);
telegramBtn.addEventListener('click', () => shareMeme('telegram'));
twitterBtn.addEventListener('click', () => shareMeme('twitter'));
blueskyBtn.addEventListener('click', () => shareMeme('bluesky'));
scrollTopBtn.addEventListener('click', scrollToTop);
themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('scroll', checkScroll);

// Close overlay when clicking outside
memeOverlay.addEventListener('click', (e) => {
    if (e.target === memeOverlay) {
        closeMeme();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && memeOverlay.classList.contains('active')) {
        closeMeme();
    }
});
