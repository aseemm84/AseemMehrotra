document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainContainer = document.getElementById('main-container');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
                mainContainer.classList.remove('hidden');
                mainContainer.style.opacity = '1';
                mainContainer.style.transition = 'opacity 0.5s ease';
                startTyping();
                loadContent('about'); 
                document.querySelector('.nav-item[data-section="about"]').classList.add('active');
            });
        }, 2000);
    });

    const typingTextElement = document.getElementById('typing-text');
    const textToType = "Bridging 17+ Years of Industrial Expertise with Data Science & AI";
    let charIndex = 0;

    function startTyping() {
        if (charIndex < textToType.length) {
            typingTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(startTyping, 50);
        }
    }

    const navItems = document.querySelectorAll('.nav-item');
    const contentDisplay = document.getElementById('content-display');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            loadContent(sectionId);
        });
    });

    function loadContent(sectionId) {
        const template = document.getElementById(`template-${sectionId}`);
        if (template) {
            contentDisplay.innerHTML = '';
            const clone = template.content.cloneNode(true);
            const sectionElement = clone.querySelector('.content-section');
            contentDisplay.appendChild(clone);
            sectionElement.style.display = 'block';
        }
    }

    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    let columns = canvas.width / fontSize;
    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const drawMatrix = () => {
        ctx.fillStyle = 'rgba(2, 12, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#64ffda';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    let matrixInterval = setInterval(drawMatrix, 33);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = canvas.width / fontSize;
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }
    });
});
