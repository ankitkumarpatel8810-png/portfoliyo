/**
 * FRAMEON — Hero Section Interactions & Subtle Particles
 * Minimal, high-end hero animations with atmospheric particle system.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouchDevice, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  try {
    const hero = document.getElementById('hero');
    if (!hero) return;

    /* ── 1. Intro Entrance Animations ── */
    if (!prefersReducedMotion()) {
      const eyebrow = hero.querySelector('.hero__eyebrow');
      const headline = hero.querySelector('.hero__headline');
      const sub = hero.querySelector('.hero__sub');
      const buttons = hero.querySelector('.hero__buttons');
      const visual = hero.querySelector('.hero__visual');

      const elementsToAnimate = [eyebrow, headline, sub, buttons, visual].filter(Boolean);

      gsap.from(elementsToAnimate, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });

      if (visual) {
        gsap.to(visual, {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    }

    /* ── 2. Canvas Particles Background (Atmospheric & Ultra Subtle) ── */
    const canvas = hero.querySelector('.hero__particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let particles = [];
      let mouse = { x: null, y: null, radius: 120 };

      const resizeCanvas = () => {
        canvas.width = hero.clientWidth;
        canvas.height = hero.clientHeight;
        initParticles();
      };

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 1.5 + 0.8; // 0.8px to 2.3px
          this.baseX = this.x;
          this.baseY = this.y;
          this.density = (Math.random() * 20) + 5;
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.speedY = (Math.random() - 0.5) * 0.3;
        }

        draw() {
          ctx.fillStyle = 'rgba(242, 242, 240, 0.08)'; // Ultra subtle off-white
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }

        update() {
          // Slow constant drift
          this.x += this.speedX;
          this.y += this.speedY;

          // Bounce off boundaries
          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

          // Mouse interaction (push away gently)
          if (mouse.x !== null && mouse.y !== null && !isTouchDevice()) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
              let forceDirectionX = dx / distance;
              let forceDirectionY = dy / distance;
              let maxDistance = mouse.radius;
              let force = (maxDistance - distance) / maxDistance;
              let directionX = forceDirectionX * force * this.density * 0.4;
              let directionY = forceDirectionY * force * this.density * 0.4;

              this.x -= directionX;
              this.y -= directionY;
            }
          }
        }
      }

      const initParticles = () => {
        particles = [];
        // Max 40 particles for clean atmosphere
        const numberOfParticles = Math.min((canvas.width * canvas.height) / 25000, 40);
        for (let i = 0; i < numberOfParticles; i++) {
          particles.push(new Particle());
        }
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Connect lines
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 90) {
              ctx.strokeStyle = `rgba(242, 242, 240, ${0.04 * (1 - distance/90)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      // Mouse move
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };

      const handleMouseLeave = () => {
        mouse.x = null;
        mouse.y = null;
      };

      window.addEventListener('resize', resizeCanvas);
      hero.addEventListener('mousemove', handleMouseMove);
      hero.addEventListener('mouseleave', handleMouseLeave);

      resizeCanvas();
      animate();
    }
  } catch (e) {
    // Graceful degradation
  }
}
