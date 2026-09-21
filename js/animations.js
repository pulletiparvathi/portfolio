/**
 * Scroll reveal animations and interactive SVG diagram operations.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. INTERSECTION OBSERVER REVEAL LOGIC
       ========================================================================== */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal-in');
    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       2. INTERACTIVE BACKEND ARCHITECTURE DIAGRAM
       ========================================================================== */
    // Inject CSS Keyframe for packet motion dynamically to ensure it runs correctly
    const style = document.createElement('style');
    style.textContent = `
        @keyframes movePacket {
            from { offset-distance: 0%; }
            to { offset-distance: 100%; }
        }
        .data-packet {
            animation: movePacket 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
    `;
    document.head.appendChild(style);

    // Node descriptions mapping
    const nodeDetails = {
        "client": "<strong>Client / Frontend App</strong>: Sends API requests (GET, POST, etc.) and consumes JSON outputs.",
        "api gateway": "<strong>Django & DRF Gateway</strong>: Processes requests, maps ORM entities, executes business logic, and serves REST payloads.",
        "security": "<strong>JWT Authentication Layer</strong>: Handles token generation, security validation, and role-based permissions validation.",
        "database": "<strong>PostgreSQL Database</strong>: Relational database holding user details, transaction indices, and optimized tables schemas.",
        "cache": "<strong>Redis Cache Store</strong>: Speeds up performance with in-memory caching and stores Celery asynchronous job statuses."
    };

    // Tooltip interaction
    const tooltip = document.getElementById('node-tooltip');
    const nodes = document.querySelectorAll('.arch-svg .node');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const label = node.getAttribute('data-label');
            const lowerLabel = label.toLowerCase();
            
            // Match substring to determine which text to load
            let matchedText = "Architecture component active.";
            for (const key in nodeDetails) {
                if (lowerLabel.includes(key)) {
                    matchedText = nodeDetails[key];
                    break;
                }
            }
            
            if (tooltip) {
                tooltip.innerHTML = matchedText;
                tooltip.style.borderColor = 'var(--accent)';
                tooltip.style.boxShadow = '0 0 10px rgba(20, 184, 166, 0.15)';
            }
        });

        node.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.innerHTML = "Hover over nodes to inspect details";
                tooltip.style.borderColor = 'var(--border-color)';
                tooltip.style.boxShadow = 'none';
            }
        });
    });

    // Flow packets generator
    function sendPacket(pathId, color) {
        const svg = document.querySelector('.arch-svg');
        const path = document.getElementById(pathId);
        if (!svg || !path) return;
        
        const d = path.getAttribute('d');
        
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '4.5');
        packet.setAttribute('fill', color);
        packet.setAttribute('class', 'data-packet');
        packet.style.filter = 'drop-shadow(0 0 3px ' + color + ')';
        
        // CSS properties for motion path
        packet.style.offsetPath = `path('${d}')`;
        packet.style.offsetDistance = '0%';
        
        svg.appendChild(packet);
        
        // Remove after execution
        setTimeout(() => {
            packet.remove();
        }, 2050);
    }

    // Set loop timers to dispatch packets
    function runSimulation() {
        // Dispatch client -> gateway
        sendPacket('path-client-gateway', 'var(--primary)');
        
        // Dispatch gateway -> security
        setTimeout(() => {
            sendPacket('path-gateway-auth', 'var(--accent)');
        }, 800);

        // Dispatch gateway -> database
        setTimeout(() => {
            sendPacket('path-gateway-db', 'var(--primary)');
        }, 1100);

        // Dispatch gateway -> cache
        setTimeout(() => {
            sendPacket('path-gateway-cache', 'var(--accent)');
        }, 1300);
    }

    // Start simulation immediately and loop
    if (document.querySelector('.arch-svg')) {
        runSimulation();
        setInterval(runSimulation, 3000);
    }
});
