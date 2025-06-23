const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numParticles = 200;

let formingHeart = false;

class Particle {
    constructor() {
        this.reset();
        this.size = 3;
        this.targetX = null;
        this.targetY = null;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    update() {
        if (formingHeart) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
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

function heartShape(t, scale) {
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        const p = new Particle();
        particles.push(p);
    }
}

createParticles();

function formHeart() {
    formingHeart = true;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 50;

    particles.forEach((particle, index) => {
        const t = (index / numParticles) * Math.PI * 2;
        const pos = heartShape(t, scale);
        particle.targetX = centerX + pos.x;
        particle.targetY = centerY + pos.y;
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
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

// 🎶 Música
const playButton = document.getElementById('playButton');
const audio = document.getElementById('audio');

audio.volume = 0.05; // Volume baixo

playButton.addEventListener('click', () => {
    audio.play();
    setTimeout(() => {
        formHeart();
    }, 10000); // Forma o coração 10 segundos depois do play
});
