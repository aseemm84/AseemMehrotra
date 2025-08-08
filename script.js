/**
 * @file Main script for the Interactive Resume Web App.
 * @author Aseem Mehrotra & Gemini
 * @version 2.2.0
 * @description This script handles data fetching, DOM population, 3D animations, and scroll-based interactions.
 */

// --- MODULE: GLOBAL STATE & CONFIGURATION ---
const state = {
    data: null,
    three: {
        skills: {
            scene: null,
            camera: null,
            renderer: null,
            raycaster: null,
            mouse: null,
            skillsGroup: null,
            INTERSECTED: null
        }
    }
};

const config = {
    jsonPath: './ultimate_resume_data.json',
    navLinks: [
        { href: '#vision', text: 'Home', icon: '<svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>' },
        { href: '#timeline', text: 'Timeline', icon: '<svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>' },
        { href: '#skills', text: 'Skills', icon: '<svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m6 10v4m-2-2h4M17 3l-4.5 4.5M17 17l-4.5-4.5M7 17l4.5-4.5M7 7l4.5 4.5"></path></svg>' },
        { href: '#projects', text: 'Projects', icon: '<svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>' },
    ]
};


// --- MODULE: DATA HANDLING ---
async function loadData() {
    try {
        const response = await fetch(config.jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        state.data = await response.json();
    } catch (error) {
        console.error("Could not load resume data:", error);
        document.body.innerHTML = `<div class="h-screen w-screen flex items-center justify-center text-red-500 text-center p-4">
            <p><strong>Error:</strong> Failed to load resume data from <code>${config.jsonPath}</code>.</p>
            <p class="mt-2 text-sm text-slate-400">Please ensure the file exists and is accessible. Check the browser console for more details.</p>
        </div>`;
        throw error; // Stop execution if data fails to load
    }
}


// --- MODULE: DOM POPULATION ---
const DOM = {
    populateNav: () => {
        const container = document.getElementById('main-nav');
        container.innerHTML = config.navLinks.map(link => `
            <a href="${link.href}" class="flex items-center p-2 rounded-lg hover:bg-cyan-900/50 transition-colors duration-300">
                ${link.icon}
                <span class="ml-4 hidden lg:inline">${link.text}</span>
            </a>
        `).join('');
    },
    populateLanding: () => {
        document.getElementById('landing-name').textContent = state.data.personalInfo.name;
        const taglineEl = document.getElementById('landing-tagline');
        let taglineIndex = 0;
        taglineEl.textContent = state.data.personalInfo.taglines[0];
        setInterval(() => {
            taglineIndex = (taglineIndex + 1) % state.data.personalInfo.taglines.length;
            gsap.to(taglineEl, {
                opacity: 0, duration: 0.5, onComplete: () => {
                    taglineEl.textContent = state.data.personalInfo.taglines[taglineIndex];
                    gsap.to(taglineEl, { opacity: 1, duration: 0.5 });
                }
            });
        }, 3000);
    },
    populateImpactMeters: () => {
        const container = document.getElementById('impact-meters-container');
        container.innerHTML = state.data.impactMeters.map(meter => {
            const initialText = `${meter.prefix || ''}0${meter.unit || ''}`;
            return `
            <div class="glass-panel p-6 rounded-xl">
                <div class="font-orbitron text-4xl font-bold text-cyan-400" data-value="${meter.value}" data-prefix="${meter.prefix || ''}" data-unit="${meter.unit || ''}">${initialText}</div>
                <div class="text-sm text-slate-400 mt-2">${meter.label}</div>
            </div>
        `}).join('');
    },
    populateTimeline: () => {
        const container = document.getElementById('timeline-container');
        container.innerHTML = state.data.timeline.map(item => {
            const alignment = item.strand === 'industrial' ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8';
            const icon = item.strand === 'industrial' ? '⚙️' : '🤖';
            const border = item.strand === 'industrial' ? 'border-sky-500' : 'border-fuchsia-500';
            return `
            <div class="timeline-item w-full lg:w-1/2 ${alignment} relative">
                <div class="absolute top-5 ${item.strand === 'industrial' ? 'lg:-right-4' : 'lg:-left-4'} w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xl z-10 border-2 ${border}">
                    ${icon}
                </div>
                <div class="glass-panel p-6 rounded-lg border-l-4 ${border}">
                    <p class="text-sm text-cyan-400">${item.period}</p>
                    <h3 class="font-bold text-xl mt-1">${item.role}</h3>
                    <p class="text-slate-300 font-semibold">${item.company}</p>
                    <ul class="mt-4 space-y-2 text-slate-400 text-sm list-disc list-inside">
                        ${item.points.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        }).join('');
    },
    populateProjects: () => {
        const container = document.getElementById('projects-container');
        container.innerHTML = state.data.projects.map(p => `
            <div class="glass-panel rounded-lg overflow-hidden group flex flex-col">
                <div class="p-6 flex-grow">
                    <h3 class="font-orbitron text-2xl font-bold text-cyan-400">${p.name}</h3>
                    <p class="text-slate-400 mt-2 h-12">${p.description}</p>
                </div>
                <div class="flex space-x-4 p-6 pt-0">
                    <a href="${p.codeUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">Code ↗</a>
                    <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors">Live App ↗</a>
                </div>
            </div>
        `).join('');
    },
    populateCertifications: () => {
        const container = document.getElementById('certifications-container');
        container.innerHTML = state.data.certifications.map(c => `
            <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="hex-badge-wrapper">
                <div class="hex-badge">
                    <div>
                        <p class="font-bold text-cyan-400">${c.name}</p>
                        <p class="text-xs text-slate-400 mt-2">${c.issuer}</p>
                    </div>
                </div>
            </a>
        `).join('');
    },
    populateAll: () => {
        DOM.populateNav();
        DOM.populateLanding();
        DOM.populateImpactMeters();
        DOM.populateTimeline();
        DOM.populateProjects();
        DOM.populateCertifications();
    }
};


// --- MODULE: 3D & ANIMATIONS ---
const Animations = {
    initLandingAnimation: () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('landing-canvas'), alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 5;

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCnt = 5000;
        const posArray = new Float32Array(particlesCnt * 3);
        for (let i = 0; i < particlesCnt * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0x00ffff });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    },
    initSkillsGalaxy: () => {
        const s = state.three.skills;
        const canvas = document.getElementById('skills-canvas');
        s.scene = new THREE.Scene();
        s.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        s.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        s.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        s.camera.position.z = 200;

        s.raycaster = new THREE.Raycaster();
        s.mouse = new THREE.Vector2();
        s.skillsGroup = new THREE.Group();
        
        const skillCategories = ['All', ...new Set(state.data.skills.map(skill => skill.category))];
        const colors = { 'Data Science': 0x00ffff, 'Engineering': 0x00ff00, 'Leadership': 0xffff00 };

        state.data.skills.forEach(skill => {
            const material = new THREE.SpriteMaterial({
                color: colors[skill.category],
                opacity: 0.5 + skill.proficiency * 0.5,
                transparent: true
            });
            const sprite = new THREE.Sprite(material);
            sprite.position.setFromSphericalCoords(100, Math.acos(-1 + (2 * Math.random())), Math.sqrt(4 * Math.PI) * Math.random());
            sprite.scale.set(4, 4, 1);
            sprite.userData = { name: skill.name, category: skill.category };
            s.skillsGroup.add(sprite);
        });
        s.scene.add(s.skillsGroup);

        const animate = () => {
            requestAnimationFrame(animate);
            s.skillsGroup.rotation.y += 0.0005;
            s.renderer.render(s.scene, s.camera);
        };
        animate();
        
        // Filters
        const filtersContainer = document.getElementById('skill-filters');
        filtersContainer.innerHTML = skillCategories.map(cat => `<button data-category="${cat}" class="skill-filter-btn glass-panel px-3 py-1 md:px-4 md:py-2 rounded-full text-sm">${cat}</button>`).join('');
        filtersContainer.addEventListener('click', e => {
            if (e.target.classList.contains('skill-filter-btn')) {
                const category = e.target.dataset.category;
                s.skillsGroup.children.forEach(child => {
                    child.visible = (category === 'All' || child.userData.category === category);
                });
            }
        });
    },
    initScrollAnimations: () => {
        gsap.registerPlugin(ScrollTrigger);

        // --- FIX START: Robust Impact Meter Animation ---
        const metersContainer = document.querySelector('#impact-meters-container');
        if (metersContainer) {
            const meters = metersContainer.querySelectorAll('[data-value]');
            
            ScrollTrigger.create({
                trigger: metersContainer,
                start: "top 80%",
                once: true, // Ensures the animation runs only once
                onEnter: () => {
                    meters.forEach(meter => {
                        const endValue = parseFloat(meter.dataset.value);
                        const prefix = meter.dataset.prefix || '';
                        const unit = meter.dataset.unit || '';

                        let proxy = { value: 0 };

                        gsap.to(proxy, {
                            value: endValue,
                            duration: 2,
                            ease: "power1.inOut",
                            onUpdate: () => {
                                meter.textContent = prefix + Math.ceil(proxy.value) + unit;
                            },
                            onComplete: () => {
                                // Ensure the final value is precise and correct
                                meter.textContent = prefix + endValue + unit;
                            }
                        });
                    });
                }
            });
        }
        // --- FIX END ---

        // Timeline items fade-in
        document.querySelectorAll('.timeline-item').forEach(item => {
            gsap.from(item, {
                opacity: 0,
                x: item.classList.contains('lg:mr-auto') ? -100 : 100,
                duration: 1,
                scrollTrigger: { trigger: item, start: "top 85%" }
            });
        });

        // Rocket progress bar
        gsap.to('#progress-rocket', {
            bottom: 'calc(100% - 2rem)',
            ease: 'none',
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
        });
    },
    initAll: () => {
        Animations.initLandingAnimation();
        Animations.initSkillsGalaxy();
        Animations.initScrollAnimations();
    }
};


// --- MODULE: EVENT LISTENERS ---
const Events = {
    setupSkillsGalaxyMouseEvents: () => {
        const s = state.three.skills;
        const tooltip = document.getElementById('skill-tooltip');

        const onMouseMove = (event) => {
            event.preventDefault();
            const rect = s.renderer.domElement.getBoundingClientRect();
            s.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            s.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            s.raycaster.setFromCamera(s.mouse, s.camera);
            const intersects = s.raycaster.intersectObjects(s.skillsGroup.children.filter(c => c.visible));

            if (intersects.length > 0) {
                if (s.INTERSECTED !== intersects[0].object) {
                    if (s.INTERSECTED) s.INTERSECTED.material.color.setHex(s.INTERSECTED.currentHex);
                    s.INTERSECTED = intersects[0].object;
                    s.INTERSECTED.currentHex = s.INTERSECTED.material.color.getHex();
                    s.INTERSECTED.material.color.setHex(0xffffff);
                    tooltip.style.display = 'block';
                    tooltip.textContent = s.INTERSECTED.userData.name;
                }
                tooltip.style.left = (event.clientX + 15) + 'px';
                tooltip.style.top = (event.clientY + 15) + 'px';
            } else {
                if (s.INTERSECTED) s.INTERSECTED.material.color.setHex(s.INTERSECTED.currentHex);
                s.INTERSECTED = null;
                tooltip.style.display = 'none';
            }
        };
        window.addEventListener('mousemove', onMouseMove, false);
    },
    setupAll: () => {
        Events.setupSkillsGalaxyMouseEvents();
    }
};


// --- MODULE: MAIN APPLICATION BOOTSTRAP ---
async function main() {
    try {
        await loadData();
        DOM.populateAll();
        Animations.initAll();
        Events.setupAll();
    } catch (error) {
        console.error("Application failed to initialize:", error);
    }
}

// --- Run Application ---
main();
