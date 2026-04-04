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

    window.addEventListener('load', () => {
        if (preloader) {
            if (siteEntered && !isReload) {
                // Skip full animation on internal navigation
                preloader.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            } else {
                // Full entrance sequence for first-time arrival OR reload
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    body.classList.remove('loading');
                    body.classList.add('loaded');
                    
                    sessionStorage.setItem('site_entered', 'true');

                    // Remove preloader from DOM after transition
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800);
                }, 500); 
            }
        } else {
            body.classList.add('loaded');
        }
    });

    // Glitch effect removed as requested
});
