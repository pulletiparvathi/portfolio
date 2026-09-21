/**
 * Main application logic, including loader, navbar, modal, form validation, and theme toggle.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. TERMINAL LOADER SIMULATION
       ========================================================================== */
    const consoleLogs = [
        "Connecting to PostgreSQL Database... Connected (0.12s)",
        "Running system migrations... OK",
        "Loading JWT authentication keys... Loaded",
        "Initializing Django REST Framework API routing...",
        " -> GET  /api/v1/profile/ (200 OK)",
        " -> GET  /api/v1/skills/ (200 OK)",
        " -> GET  /api/v1/student-management/ (200 OK)",
        " -> GET  /api/v1/medical-shop/ (200 OK)",
        " -> POST /api/v1/contact/ (200 OK)",
        "Mounting static asset structures...",
        "Starting Gunicorn development server on port 8000...",
        "Deployment completed successfully! Serving application."
    ];

    const loaderConsole = document.getElementById('loader-console');
    const loaderProgressBar = document.getElementById('loader-progress');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderOverlay = document.getElementById('loader');
    
    let logIndex = 0;
    let progress = 0;

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Simulate logs output
    function printNextLog() {
        if (logIndex < consoleLogs.length && loaderConsole) {
            const p = document.createElement('p');
            p.className = 'console-line';
            p.innerHTML = `<span style="color: var(--primary);">></span> ${consoleLogs[logIndex]}`;
            loaderConsole.appendChild(p);
            loaderConsole.scrollTop = loaderConsole.scrollHeight;
            logIndex++;
            
            // Random delay between logs
            setTimeout(printNextLog, Math.random() * 200 + 80);
        }
    }

    // Simulate progress bar percentage
    function updateProgress() {
        if (progress < 100) {
            progress += 1;
            if (loaderProgressBar) loaderProgressBar.style.width = `${progress}%`;
            if (loaderPercent) loaderPercent.innerHTML = `${progress}%`;
            
            // Sync loader timing roughly with logs
            setTimeout(updateProgress, 20);
        } else {
            // Dismiss loader after progress hits 100%
            setTimeout(() => {
                if (loaderOverlay) {
                    loaderOverlay.style.opacity = '0';
                    loaderOverlay.style.visibility = 'hidden';
                }
                // Restore body scrolling
                document.body.style.overflow = '';
            }, 400);
        }
    }

    // Start simulations
    printNextLog();
    updateProgress();

    /* ==========================================================================
       2. STICKY NAVBAR & SCROLL PROGRESS INDICATOR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercentage = (scrollTop / docHeight) * 100;

        // Sticky Nav styling update
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Top progress indicator width
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolledPercentage}%`;
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // Back to top button action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       3. MOBILE NAVIGATION MENU DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        if (mobileMenuDrawer) mobileMenuDrawer.classList.add('open');
    }

    function closeDrawer() {
        if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('open');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    /* ==========================================================================
       4. SCROLL SPY (ACTIVE NAV HIGHLIGHT) & SMOOTH SCROLLING
       ========================================================================== */
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');
    const allLinks = document.querySelectorAll('.nav-link, .drawer-link, .logo, .hero-actions a');

    // Smooth Scroll navigation
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 75; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll spy logic
    function scrollSpy() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Anchor offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       5. DARK / LIGHT THEME TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check localStorage or system configurations
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            } else {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            }
        });
    }

    /* ==========================================================================
       6. PROJECT DETAIL MODAL DATA & CONTROLLER
       ========================================================================== */
    const projectData = {
        "student-management-system": {
            title: "Student Management System",
            category: "Academic & Campus Administration System",
            visualClass: "student-art",
            icon: "fa-solid fa-graduation-cap",
            description: "A comprehensive web-based application engineered to streamline academic administration. Facilitates student profile management, course registrations, attendance tracking, automated grade point average (GPA) calculations, and fee payment processing.",
            features: [
                "Student, Teacher & Admin portals with dynamic role-based permissions.",
                "Automated attendance tracking system with periodic percentage summaries.",
                "Course enrollment workflows and grade entry modules with auto-GPA computation.",
                "Fee management records with payment status tracking and downloadable receipts."
            ],
            tech: ["Python", "Django", "Django REST Framework", "PostgreSQL", "HTML5", "CSS3", "JavaScript", "Git"],
            github: "https://github.com/pulletiparvathi"
        },
        "medical-shop-management-system": {
            title: "Medical Shop Management & Medicine Inventory System",
            category: "Healthcare & Pharmacy Inventory Platform",
            visualClass: "medical-art",
            icon: "fa-solid fa-prescription-bottle-medical",
            description: "A web-based medical shop management platform engineered with Django REST Framework, React, and PostgreSQL. Enables pharmacy owners to manage medicine stock, batch numbers, unit prices, expiry dates, and low-stock alerts. Includes emergency medicine discovery REST APIs designed for location-based search and distance tracking to help users locate nearby in-stock pharmacies rapidly during critical situations.",
            features: [
                "Medical shop registration and comprehensive inventory management (quantities, prices, batch numbers, expiry dates).",
                "Real-time low-stock tracking notifications and medicine availability search capabilities.",
                "Emergency Location-Based Search: Pincode and GPS coordinate REST APIs returning nearby shop availability and distance estimation.",
                "Planned architecture for MediFinder app integration to locate nearby medical shops and open navigation directions.",
                "Designed extensibility to support future AI Prescription Scanner OCR extraction and medicine matching."
            ],
            tech: ["Python", "Django", "Django REST Framework", "PostgreSQL", "React", "Vite", "JavaScript", "HTML5", "CSS3", "REST APIs", "Git", "GitHub", "Postman"],
            github: "https://github.com/pulletiparvathi"
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalContentArea = document.getElementById('modal-content-area');
    const detailsButtons = document.querySelectorAll('.btn-details');

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data || !modalContentArea || !modalOverlay) return;

        // Construct modal content HTML
        let techBadgesHTML = '';
        data.tech.forEach(t => {
            techBadgesHTML += `<span class="project-tag-badge">${t}</span>`;
        });

        let bulletsHTML = '';
        data.features.forEach(f => {
            bulletsHTML += `<li><i class="fa-solid fa-chevron-right" style="font-size:0.8rem; color:var(--accent);"></i> <span>${f}</span></li>`;
        });

        modalContentArea.innerHTML = `
            <div class="modal-hero-visual ${data.visualClass}">
                <i class="${data.icon}"></i>
            </div>
            <div class="modal-title-row">
                <div>
                    <span class="edu-level">${data.category}</span>
                    <h2>${data.title}</h2>
                </div>
            </div>
            <div class="modal-body-section">
                <div class="modal-details-col">
                    <h3>Project Details</h3>
                    <p>${data.description}</p>
                    <h3>Key Features</h3>
                    <ul class="modal-bullets-list">
                        ${bulletsHTML}
                    </ul>
                </div>
                <div class="modal-meta-col">
                    <div class="modal-meta-box">
                        <div class="meta-box-item">
                            <span>Repository Host</span>
                            <p>GitHub</p>
                        </div>
                        <div class="meta-box-item">
                            <span>Status</span>
                            <p>Completed / Active</p>
                        </div>
                        <div class="meta-box-item">
                            <span>Technologies Used</span>
                            <div class="project-tech-tags" style="margin-top:8px;">
                                ${techBadgesHTML}
                            </div>
                        </div>
                    </div>
                    <a href="${data.github}" target="_blank" class="btn btn-primary-filled" style="width:100%;"><i class="fa-brands fa-github"></i> View Repository</a>
                </div>
            </div>
        `;

        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
        }
        document.body.style.overflow = ''; // Unlock scroll
    }

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-project');
            openModal(id);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal if user clicks outside of modal card
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    /* ==========================================================================
       7. CONTACT FORM VALIDATION & HANDLING
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');

            let isValid = true;

            // Helper functions
            function setError(input, errorId, show) {
                const group = input.closest('.input-group');
                if (show) {
                    group.classList.add('has-error');
                    isValid = false;
                } else {
                    group.classList.remove('has-error');
                }
            }

            // Name validation
            if (nameInput.value.trim() === '') {
                setError(nameInput, 'error-name', true);
            } else {
                setError(nameInput, 'error-name', false);
            }

            // Email validation (regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput, 'error-email', true);
            } else {
                setError(emailInput, 'error-email', false);
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                setError(messageInput, 'error-message', true);
            } else {
                setError(messageInput, 'error-message', false);
            }

            if (isValid) {
                // Submit Simulation
                const submitBtn = document.getElementById('btn-submit');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnIcon = submitBtn.querySelector('.btn-icon');

                if (submitBtn && btnText && btnIcon) {
                    submitBtn.disabled = true;
                    btnText.innerHTML = "Sending Message...";
                    btnIcon.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
                }

                setTimeout(() => {
                    // Restore button
                    if (submitBtn && btnText && btnIcon) {
                        submitBtn.disabled = false;
                        btnText.innerHTML = "Send Message";
                        btnIcon.innerHTML = `<i class="fa-regular fa-paper-plane"></i>`;
                    }

                    // Success Feedback
                    if (formResult) {
                        formResult.className = 'form-result success';
                        formResult.innerHTML = "Thank you! Your message has been sent successfully. Parvathi will get back to you shortly.";
                        formResult.style.display = 'block';
                    }

                    // Reset form
                    contactForm.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        if (formResult) formResult.style.display = 'none';
                    }, 5000);

                }, 1500);
            }
        });
    }

    /* ==========================================================================
       8. GENERAL INITS
       ========================================================================== */
    // Footer Current Year Set
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.innerHTML = new Date().getFullYear();
    }
});
