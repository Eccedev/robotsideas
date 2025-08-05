
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
const facebookBtn = document.getElementById('facebook-btn');
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
        // Fallback data if JSON fails to load
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
    
    // Add click event to memes
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
    let url = '';
    
    switch(platform) {
        case 'telegram':
            url = `https://t.me/share/url?url=${encodeURIComponent(currentMeme.image)}&text=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentMeme.image)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentMeme.image)}&quote=${encodeURIComponent(text)}`;
            break;
    }
    
    if (url) {
        window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
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
    
    // Save theme preference
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
        // Ignore if localStorage is not available
    }
}

// Check scroll position for scroll-to-top button
function checkScroll() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            themeToggle.checked = true;
        }
    } catch (e) {
        // Ignore if localStorage is not available
    }
});

// Event Listeners
randomBtn.addEventListener('click', getRandomMeme);
closeBtn.addEventListener('click', closeMeme);
downloadBtn.addEventListener('click', downloadMeme);
telegramBtn.addEventListener('click', () => shareMeme('telegram'));
twitterBtn.addEventListener('click', () => shareMeme('twitter'));
facebookBtn.addEventListener('click', () => shareMeme('facebook'));
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