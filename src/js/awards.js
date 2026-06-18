/**
 * FOUNDERY927 — Awards list interactions
 * Adds staggered scroll reveal animations for list items
 * and smooth hover micro-animations using GSAP.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAwards() {
  try {
    const awardsSection = document.getElementById('awards');
    if (!awardsSection) return;

    const cards = gsap.utils.toArray('.awards__card');
    if (cards.length === 0) return;

    // Set initial card states fanned out in 3D space like the reference video
    cards.forEach((card, idx) => {
      const angle = idx * -3;     // -3deg step
      const xOffset = idx * -10;   // -10px step
      const yOffset = idx * 5;    // 5px step
      const zOffset = idx * -20;   // -20px step
      const opacity = idx === 0 ? 1 : (idx === 1 ? 0.85 : (idx === 2 ? 0.65 : (idx === 3 ? 0.45 : 0.2)));
      const blur = idx * 1.5;

      gsap.set(card, {
        transformOrigin: "center bottom",
        z: zOffset,
        x: xOffset,
        y: yOffset,
        rotateZ: angle,
        rotateX: -3, // subtle forward lean for depth
        opacity: opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: idx === 0 ? "auto" : "none",
        zIndex: 100 - idx
      });
    });

    // Create ScrollTrigger Pinned Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: awardsSection,
        start: "top top",
        end: `+=${(cards.length) * 100}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Animate stack viewport entrance
    tl.from(".awards__stack-viewport", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });

    // Rotate stack wrapper entrance
    tl.from(".awards__stack-wrapper", {
      rotateY: -10,
      rotateX: 8,
      duration: 1,
      ease: "power2.out"
    }, "<");

    // Loop through cards to slide them away sequentially
    cards.forEach((card, idx) => {
      if (idx === cards.length - 1) return; // Last card stays active

      const label = `step_${idx}`;
      tl.addLabel(label);

      // Slide current card out (translates up & right with twist)
      tl.to(card, {
        y: -360,
        x: 180,
        z: 100,
        rotateZ: 12,
        rotateX: -35,
        opacity: 0,
        filter: "blur(4px)",
        duration: 1,
        ease: "power2.inOut"
      }, label);

      // Shift other cards forward in the fanned stack
      for (let j = idx + 1; j < cards.length; j++) {
        const remainingCard = cards[j];
        const relativeIdx = j - (idx + 1);

        const newAngle = relativeIdx * -3;
        const newX = relativeIdx * -10;
        const newY = relativeIdx * 5;
        const newZ = relativeIdx * -20;
        const newOpacity = relativeIdx === 0 ? 1 : (relativeIdx === 1 ? 0.85 : (relativeIdx === 2 ? 0.65 : (relativeIdx === 3 ? 0.45 : 0.2)));
        const newBlur = relativeIdx * 1.5;

        tl.to(remainingCard, {
          z: newZ,
          x: newX,
          y: newY,
          rotateZ: newAngle,
          rotateX: -3,
          opacity: newOpacity,
          filter: `blur(${newBlur}px)`,
          pointerEvents: relativeIdx === 0 ? "auto" : "none",
          duration: 1,
          ease: "power2.inOut"
        }, label);
      }
    });

    // Card Glow coordinates tracker & Parallax Tilt
    if (!prefersReducedMotion()) {
      // Glow Coordinates
      cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });
      });

      // Stack Tilt Parallax
      const wrapper = awardsSection.querySelector('.awards__stack-wrapper');
      if (wrapper) {
        let xTo = gsap.quickTo(wrapper, "rotateY", { duration: 0.4, ease: "power2.out" });
        let yTo = gsap.quickTo(wrapper, "rotateX", { duration: 0.4, ease: "power2.out" });

        awardsSection.addEventListener("mousemove", (e) => {
          const rect = awardsSection.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          const tiltX = (y / (rect.height / 2)) * -5; // Max 5 degrees tilt
          const tiltY = (x / (rect.width / 2)) * 5;   // Max 5 degrees tilt

          xTo(tiltY);
          yTo(tiltX);
        });

        awardsSection.addEventListener("mouseleave", () => {
          xTo(0);
          yTo(0);
        });
      }
    }

  } catch (err) {
    // Fail silently
  }
}
