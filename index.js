// index.js - Final Clean Version (No Bouncing Arrow)

document.addEventListener('DOMContentLoaded', function() {
    initAllEffects();
    
    // Hide scrollbar globally
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
});

function initAllEffects() {
    initScrollReveal();
    initStatsAnimation();
    initRippleButtons();
    // Removed initScrollIndicator() completely
    initCursorTrail();
    initParticleSystem();
    window.addEventListener('resize', debounce(handleResize, 250));
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hero-text').forEach(el => {
        observer.observe(el);
    });
}

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        if (!hasAnimated && entries[0].isIntersecting) {
            stats.forEach(stat => animateCounter(stat));
            hasAnimated = true;
        }
    });

    observer.observe(document.querySelector('.hero-stats'));
}

function animateCounter(stat) {
    const targetText = stat.textContent;
    let current = 0;
    
    // Only animate 24/7 stat
    if (targetText === '24/7') {
        const timer = setInterval(() => {
            current += 0.5;
            if (current >= 24) {
                stat.textContent = '24/7';
                clearInterval(timer);
            } else {
                stat.textContent = `${Math.floor(current)}/7`;
            }
        }, 50);
    }
}

function initRippleButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-4px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
}

function createRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;
    
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function initCursorTrail() {
    const trail = document.createElement('div');
    trail.id = 'cursor-trail';
    document.body.appendChild(trail);
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.3;
    `;
    document.querySelector('.hero').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 25; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleResize() {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
}

// Ultra-minimal CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
    }
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #cursor-trail {
        position: fixed;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, rgba(78,205,196,0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
    }
    /* No scrollbar */
    html, body {
        overflow: hidden !important;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none;
    }
`;
document.head.appendChild(style);