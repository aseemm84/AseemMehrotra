document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    const mainContent = document.getElementById('main-content');
    const themeToggleButton = document.getElementById('theme-toggle');
    const navButtons = document.querySelectorAll('.nav-button');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- THEME SETUP ---
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 1 0 1.06l-1.591 1.59a.75.75 0 1 1-1.06-1.06l1.59-1.59a.75.75 0 0 1 1.06 0ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.836 17.894a.75.75 0 0 1 1.06 0l1.59 1.59a.75.75 0 1 1-1.06 1.06l-1.59-1.59a.75.75 0 0 1 0-1.06ZM12 21.75a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0V21a.75.75 0 0 1-.75.75ZM5.106 17.894a.75.75 0 0 1 0-1.06l1.59-1.591a.75.75 0 1 1 1.06 1.06l-1.59 1.59a.75.75 0 0 1-1.06 0ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM6.164 6.106a.75.75 0 0 1 1.06 0l1.59 1.59a.75.75 0 1 1-1.06 1.06L6.164 7.166a.75.75 0 0 1 0-1.06Z"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69a.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 12 22.5C6.201 22.5 1.5 17.799 1.5 12A10.503 10.503 0 0 1 2.25 6.34a.75.75 0 0 1 .819-.162l4.942 1.346a.75.75 0 0 1 .69.981Z" clip-rule="evenodd" /></svg>`;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeToggleButton.innerHTML = moonIcon;
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeToggleButton.innerHTML = sunIcon;
        }
    };

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- PRELOADER LOGIC ---
    window.addEventListener('load', () => {
        progressBar.style.width = '100%';
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
                mainContent.classList.remove('hidden');
            });
        }, 1800);
    });

    // --- MODAL LOGIC ---
    const openModal = (sectionId) => {
        const template = document.getElementById(`template-${sectionId}`);
        if (template) {
            modalBody.innerHTML = ''; // Clear previous content
            modalBody.appendChild(template.content.cloneNode(true));
            modalContainer.classList.remove('hidden');
        }
    };

    const closeModal = () => {
        modalContainer.classList.add('hidden');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            openModal(sectionId);
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
            closeModal();
        }
    });
});
