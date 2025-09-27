// Smooth navigation and section switching
class SimpleRouter {
    constructor() {
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
                this.updateActiveNav(e.target);
            });
        });

        // Handle intro button clicks
        document.querySelectorAll('.link-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
                this.updateActiveNav(document.querySelector(`[href="#${target}"]`));
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1) || 'home';
            this.showSection(hash);
            this.updateActiveNav(document.querySelector(`[href="#${hash}"]`));
        });

        // Handle initial load
        const initialHash = window.location.hash.substring(1) || 'home';
        this.showSection(initialHash);
        this.updateActiveNav(document.querySelector(`[href="#${initialHash}"]`));
    }

    showSection(targetId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update URL without reloading
            history.pushState(null, null, `#${targetId}`);
            
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        if (activeLink && activeLink.classList.contains('nav-link')) {
            activeLink.classList.add('active');
        }
    }
}

// Typing animation for the home section
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.currentText = '';
    }

    type() {
        const fullText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;
        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting new text
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    start() {
        this.type();
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        document.querySelectorAll('.project-card, .essay-item').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Smooth scroll for internal links
function smoothScrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility function to handle external links
function handleExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// Theme switching (optional feature for future)
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.theme === 'auto') {
                    this.applyTheme();
                }
            });
        }
    }

    applyTheme() {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = this.theme === 'dark' || (this.theme === 'auto' && prefersDark);
        
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }
}

// Performance optimization: Lazy loading for project images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize router for navigation
    new SimpleRouter();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Initialize theme manager
    new ThemeManager();
    
    // Handle external links
    handleExternalLinks();
    
    // Initialize lazy loading if there are images
    lazyLoadImages();
    
    // Optional: Add typing animation to intro subtitle
    const subtitleElement = document.querySelector('.intro-subtitle');
    if (subtitleElement) {
        // Uncomment the lines below if you want a typing animation
        // const typingTexts = ['Software Engineer, 23', 'Building the future', 'Learning every day'];
        // const typing = new TypingAnimation(subtitleElement, typingTexts, 150);
        // typing.start();
    }
});

// Handle scroll events for nav transparency
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class based on scroll position
    if (scrollTop > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Add smooth reveal animations for sections
function addRevealAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .project-card,
        .essay-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .nav.scrolled {
            background-color: rgba(255, 255, 255, 0.98);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize reveal animations
addRevealAnimations();

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle ESC key to go back to home
    if (e.key === 'Escape') {
        document.querySelector('[href="#home"]').click();
    }
    
    // Handle number keys for quick navigation
    const sections = ['home', 'projects', 'essays', 'contact'];
    const keyNum = parseInt(e.key);
    if (keyNum >= 1 && keyNum <= sections.length) {
        document.querySelector(`[href="#${sections[keyNum - 1]}"]`).click();
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const loadedStyles = document.createElement('style');
    loadedStyles.textContent = `body{opacity:0;transition:opacity .3s ease;}body.loaded{opacity:1;}`;
    document.head.appendChild(loadedStyles);
});

// ================= D3 Force Network (gentle) =================
function initD3Network() {
    if (typeof d3 === 'undefined') return; // safety
    const container = document.getElementById('networkGraph');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(container).append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');


    // Glow filter (subtle, only for root 'Me')
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id','glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '2').attr('result','blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in','blur');
    merge.append('feMergeNode').attr('in','SourceGraphic');

    // Interests with weights and optional links (edit freely)
    // weight: 1 (small) -> 4 (largest)
    const interests = [
        { label: 'Me', weight: 4, url: '#home', type: 'root' },
        { label: 'Software Engineering', weight: 3, url: '#projects' },
        { label: 'AI', weight: 3, url: '#projects' },
        { label: 'Philosophy', weight: 2, url: '#essays' },
        { label: 'Electrical Engineering', weight: 2 },
        { label: '3D Printing', weight: 1 },
        { label: 'Guitar', weight: 1 },
        { label: 'Books', weight: 1, url: '#essays' },
        { label: 'Chess', weight: 1 }
    ];

    // Build nodes & links
    const nodes = [];
    const links = [];
    let id = 0;
    interests.forEach(int => {
        nodes.push({ id, type: int.type === 'root' ? 'root' : 'interest', label: int.label, weight: int.weight, url: int.url });
        id++;
    });
    // Explicit connections per user spec
    const indexByLabel = Object.fromEntries(nodes.map(n => [n.label, n.id]));
    const add = (a,b,type='core') => { links.push({ source:indexByLabel[a], target:indexByLabel[b], type }); };
    const rootLabel = 'Me';
    // Me connected to all others
    interests.filter(i=>i.label!==rootLabel).forEach(i => add(rootLabel, i.label, 'hub'));
    // Engineering (Software Engineering) connections
    add('Software Engineering','AI');
    add('Software Engineering','Electrical Engineering');
    // add('Software Engineering','3D Printing');
    // add('Software Engineering','Philosophy');
    // EE to 3D Printing
    add('Electrical Engineering','3D Printing');
    // Books to Philosophy
    add('Books','Philosophy');
    // (Guitar and Chess remain only linked to Me)

    // Decorative leaf branches (small) for non-root interests except open nodes (Guitar, Chess)
    const leafFor = (base, count) => {
        for (let k=0;k<count;k++) {
            const leafId = id++;
            nodes.push({ id: leafId, type: 'leaf', parent: base.id });
            links.push({ source: base.id, target: leafId, type: 'leaf' });
        }
    };
    nodes.filter(n=> n.type==='interest' && !['Guitar','Chess'].includes(n.label)).forEach(n => {
        const count = n.weight === 3 ? 3 : n.weight === 2 ? 2 : 1;
        leafFor(n, count);
    });

    // Scales
    const radiusScale = d3.scaleLinear().domain([1,4]).range([6,14]);
    const fontScale = d3.scaleLinear().domain([1,4]).range([9,15]);

    // Draw links first
    const link = svg.append('g').attr('class','links')
        .selectAll('line').data(links)
        .enter().append('line')
        .attr('class', d => d.type==='core' ? 'link-core' : d.type==='leaf' ? 'link-leaf' : 'link-secondary')
        .attr('stroke-opacity', d => d.type==='leaf' ? 0.4 : 0.7);

    // Nodes (circles)
    const node = svg.append('g').attr('class','nodes')
        .selectAll('circle').data(nodes)
        .enter().append('circle')
        .attr('class', d => d.type==='root' ? 'node-root clickable' : (d.type==='interest' ? `node-interest weight-${d.weight}${d.url ? ' clickable':''}` : 'node-leaf'))
        .attr('r', d => d.type==='root' ? radiusScale(d.weight) : (d.type==='interest' ? radiusScale(d.weight) : 3))
        .style('filter', d => d.type==='root' ? 'url(#glow)' : null)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Labels for interest nodes
    const labels = svg.append('g').attr('class','labels')
        .selectAll('text').data(nodes.filter(n=>n.type==='interest' || n.type==='root'))
        .enter().append('text')
        .attr('class', 'label')
        .attr('font-size', d => fontScale(d.weight))
        .attr('text-anchor','middle')
        .attr('dy', d => - (radiusScale(d.weight)+8))
        .text(d => d.label);

    // Terminal dot visuals: small outward dot beyond each leaf node
    const terminalData = links.filter(l=> l.type==='leaf');
    const terminals = svg.append('g').attr('class','terminals')
        .selectAll('circle').data(terminalData)
        .enter().append('circle')
        .attr('class','terminal')
        .attr('r',1.8);

    // ---- Deterministic Initial Layout (prevents overlap flash) ----
    (function setInitialLayout(){
        const rootNode = nodes.find(n=> n.type==='root');
        const cx = width/2, cy = height/2;
        if (rootNode) { rootNode.x = cx; rootNode.y = cy; }
        const orderedAngles = {
            // angles in degrees around circle (0 = +x, counter-clockwise)
            'Software Engineering': 210,
            'AI': 240,
            'Electrical Engineering': 150,
            '3D Printing': 120,
            'Books': 15,
            'Philosophy': 330,
            'Guitar': 270,
            'Chess': 300
        };
        const baseRadius = Math.min(width, height) / 2 - 45; // dynamic radius
        nodes.filter(n=> n.type==='interest').forEach(n => {
            const angDeg = orderedAngles[n.label] ?? (Math.random()*360);
            const a = angDeg * Math.PI/180;
            n.x = cx + baseRadius * Math.cos(a) + (Math.random()-0.5)*8; // slight jitter
            n.y = cy + baseRadius * Math.sin(a) + (Math.random()-0.5)*8;
        });
        // Place leaves slightly outward from their parent
        nodes.filter(n=> n.type==='leaf').forEach(leaf => {
            const parent = nodes.find(p => p.id === leaf.parent);
            if (!parent) return;
            const dx = parent.x - cx;
            const dy = parent.y - cy;
            const mag = Math.sqrt(dx*dx+dy*dy) || 1;
            const outward = 16 + Math.random()*22;
            leaf.x = parent.x + (dx/mag)*outward + (Math.random()-0.5)*6;
            leaf.y = parent.y + (dy/mag)*outward + (Math.random()-0.5)*6;
        });
        // Apply initial positions to elements before simulation starts
        link
            .attr('x1', d=> nodes[d.source.index ? d.source.index : d.source].x || d.source.x)
            .attr('y1', d=> nodes[d.source.index ? d.source.index : d.source].y || d.source.y)
            .attr('x2', d=> nodes[d.target.index ? d.target.index : d.target].x || d.target.x)
            .attr('y2', d=> nodes[d.target.index ? d.target.index : d.target].y || d.target.y);
        node
            .attr('cx', d=>d.x)
            .attr('cy', d=>d.y);
        labels
            .attr('x', d=>d.x)
            .attr('y', d=>d.y - (radiusScale(d.weight)+8));
        terminals.each(function(l){
            const sx = l.source.x, sy = l.source.y, tx = l.target.x, ty = l.target.y;
            const dx = tx - sx, dy = ty - sy;
            const mag = Math.sqrt(dx*dx+dy*dy) || 1;
            const ex = tx + (dx/mag)*6; const ey = ty + (dy/mag)*6;
            d3.select(this).attr('cx', ex).attr('cy', ey);
        });
    })();

    // Interactivity (click + hover)
    node.on('mouseenter', function(evt,d){
        if (d.type==='interest' || d.type==='root') {
            d3.select(this).transition().duration(180).attr('r', radiusScale(d.weight)*1.15);
        }
    }).on('mouseleave', function(evt,d){
        if (d.type==='interest' || d.type==='root') {
            d3.select(this).transition().duration(250).attr('r', d.type==='root'? radiusScale(d.weight) : radiusScale(d.weight));
        }
    }).on('click', (evt,d) => {
        if (d.url) {
            if (d.url.startsWith('#')) {
                const navLink = document.querySelector(`a[href='${d.url}']`);
                if (navLink) navLink.click();
            } else {
                window.open(d.url,'_blank','noopener');
            }
        }
    });

    // Enhanced floating force: continuous gentle motion (sinusoidal + light noise)
    function floatingForce(strength = 0.16, speed = 0.01, noise = 0.12) {
        let t = Math.random() * 50; // random phase offset
        const phases = nodes.map(n => (n.id * 0.91) + Math.random()*4);
        return function(alpha) {
            t += speed;
            const driftScale = alpha * 0.35; // tie to simulation energy
            nodes.forEach((n,i) => {
                if (n.type === 'root') return; // root stays anchored
                const localStrength = (n.type === 'leaf') ? strength * 0.55 : strength;
                const sinX = Math.sin(t + phases[i]);
                const sinY = Math.cos(t*0.85 + phases[i]*0.7);
                // base sinusoidal drift
                n.vx += localStrength * 0.04 * sinX * driftScale;
                n.vy += localStrength * 0.04 * sinY * driftScale;
                // micro-noise to avoid perfectly repeatable traces
                n.vx += (Math.random()-0.5) * localStrength * noise * 0.005;
                n.vy += (Math.random()-0.5) * localStrength * noise * 0.005;
            });
        };
    }

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody()
            .strength(d => d.type==='leaf' ? -12 : (d.type==='root'? -85 : -55))
            .distanceMax(380))
        .force('center', d3.forceCenter(width/2, height/2))
        .force('link', d3.forceLink(links).id(d=>d.id)
            .distance(l => l.type==='hub'? 170 : l.type==='leaf'? 50 : 120)
            .strength(l => l.type==='hub'? 0.4 : (l.type==='leaf'? 0.9 : 0.55)))
        .force('collision', d3.forceCollide().radius(d => d.type==='root'? radiusScale(d.weight)+24 : (d.type==='interest'? radiusScale(d.weight)+16 : 9)).iterations(2))
        .force('float', floatingForce(0.28, 0.0075, 0.28))
        .alpha(0.65)
        .alphaDecay(0.018) // slower decay so motion persists
        .on('tick', ticked);

    // Maintain a baseline energy so the float force keeps acting
    simulation.alphaTarget(0.06);

    // Subtle breathing modulation of alphaTarget (continuous, not jumpy)
    (function modulateAlpha(){
        const t = Date.now()/5000; // 5s cycle
        simulation.alphaTarget(0.055 + 0.02 * Math.sin(t));
        requestAnimationFrame(modulateAlpha);
    })();

    function ticked() {
        link
            .attr('x1', d=>d.source.x)
            .attr('y1', d=>d.source.y)
            .attr('x2', d=>d.target.x)
            .attr('y2', d=>d.target.y);

        node
            .attr('cx', d=>d.x)
            .attr('cy', d=>d.y);

        labels
            .attr('x', d=>d.x)
            .attr('y', d=>d.y - (radiusScale(d.weight)+8));

        // terminal dots placed slightly further along leaf direction
        terminals.each(function(l){
            const sx = l.source.x, sy = l.source.y, tx = l.target.x, ty = l.target.y;
            const dx = tx - sx, dy = ty - sy;
            const mag = Math.sqrt(dx*dx+dy*dy) || 1;
            const ex = tx + (dx/mag)*6; const ey = ty + (dy/mag)*6;
            d3.select(this).attr('cx', ex).attr('cy', ey);
        });
        // Keep root centered
        const root = nodes.find(n=>n.type==='root');
        if (root) { root.x = width/2; root.y = height/2; }
    }

    function dragstarted(event,d) {
        if (!event.active) simulation.alphaTarget(0.15).restart();
        d.fx = d.x; d.fy = d.y;
    }
    function dragged(event,d) { d.fx = event.x; d.fy = event.y; }
    function dragended(event,d) { if (!event.active) simulation.alphaTarget(0); d.fx=null; d.fy=null; }

    // Removed interval pulses; continuous modulation above handles motion.
}

document.addEventListener('DOMContentLoaded', initD3Network);