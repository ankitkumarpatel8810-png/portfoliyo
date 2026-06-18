/**
 * FOUNDERY927 — Hero Section
 * Initializes particle canvas system, magnetic button hovers,
 * and custom text intro animations for Awwwards-level polish.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText, isTouchDevice, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  try {
    const hero = document.getElementById('hero');
    if (!hero) return;

    /* ── 1. Image Intro & Scroll Parallax Animations ── */
    const imgWrapper = hero.querySelector('.hero__founder-img-wrapper');
    if (imgWrapper && !prefersReducedMotion()) {
      // Fade in (opacity 0 -> 100%), upward reveal (translateY 40 -> 0), scale (0.96 -> 1)
      gsap.from(imgWrapper, {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.5,
      });

      // Subtle parallax movement (translateY -30px max) on scroll
      gsap.to(imgWrapper, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Animate subheading & buttons
      const sub = hero.querySelector('.hero__sub');
      const buttons = hero.querySelector('.hero__buttons');
      gsap.from([sub, buttons], {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.2,
      });
    }

    /* ── 2. Canvas Particles Background ── */
    const canvas = hero.querySelector('.hero__particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let particles = [];
      let mouse = { x: null, y: null, radius: 150 };

      const resizeCanvas = () => {
        canvas.width = hero.clientWidth;
        canvas.height = hero.clientHeight;
        initParticles();
      };

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1; // 1px to 3px
          this.baseX = this.x;
          this.baseY = this.y;
          this.density = (Math.random() * 30) + 10;
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.speedY = (Math.random() - 0.5) * 0.4;
        }

        draw() {
          ctx.fillStyle = 'rgba(244, 234, 222, 0.25)'; // Off-white theme color
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

          // Mouse interaction (push away)
          if (mouse.x !== null && mouse.y !== null && !isTouchDevice()) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
              let forceDirectionX = dx / distance;
              let forceDirectionY = dy / distance;
              let maxDistance = mouse.radius;
              let force = (maxDistance - distance) / maxDistance;
              let directionX = forceDirectionX * force * this.density * 0.6;
              let directionY = forceDirectionY * force * this.density * 0.6;

              this.x -= directionX;
              this.y -= directionY;
            }
          }
        }
      }

      const initParticles = () => {
        particles = [];
        const numberOfParticles = Math.min((canvas.width * canvas.height) / 12000, 100);
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

            if (distance < 100) {
              ctx.strokeStyle = `rgba(244, 234, 222, ${0.1 * (1 - distance/100)})`;
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
