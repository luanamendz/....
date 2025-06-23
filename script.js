const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numParticles = 200;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    update(targetX = null, targetY = null) {
        if (targetX !== null && targetY !== null) {
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            this.x += dx * 0.05;
            this.y += dy * 0.05;
        } else {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

createParticles();

function heartShape(t) {
    const scale = 10;
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {x, y};
}

let formingHeart = false;

canvas.addEventListener('click', () => {
    if (!formingHeart) {
        formingHeart = true;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        particles.forEach((particle, index) => {
            const t = (index / particles.length) * Math.PI * 2;
            const pos = heartShape(t);
            particle.targetX = centerX + pos.x * 8;
            particle.targetY = centerY + pos.y * 8;
        });

        setTimeout(() => {
            formingHeart = false;
            particles.forEach(p => p.reset());
        }, 3000); // Fica no formato por 3 segundos
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        if (formingHeart) {
            p.update(p.targetX, p.targetY);
        } else {
            p.update();
        }
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!formingHeart) createParticles();
});
