document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    const body = document.body;
    const preloader = document.getElementById('preloader');

    // Initial loading state
    if (preloader) {
        body.classList.add('loading');
    }

    // Theme initialization and listener
    const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme, isAuto = false) {
        htmlElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        if (!isAuto) localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(themeMediaQuery.matches ? 'dark' : 'light', true);
    }

    // OS Theme change listener
    themeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', true);
        }
    });

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Preloader and Entrance Animation
    const siteEntered = sessionStorage.getItem('site_entered');
    const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';

    function startEntranceSequence() {
        if (body.classList.contains('loaded')) return; // Already started

        if (preloader) {
            if (siteEntered && !isReload) {
                preloader.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            } else {
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    body.classList.remove('loading');
                    body.classList.add('loaded');
                    sessionStorage.setItem('site_entered', 'true');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800);
                }, 500); 
            }
        } else {
            body.classList.add('loaded');
        }
    }

    // Trigger on load OR safety timeout
    window.addEventListener('load', startEntranceSequence);
    setTimeout(startEntranceSequence, 2000); // 2s Safety fallback

    // Glitch effect removed as requested
});
