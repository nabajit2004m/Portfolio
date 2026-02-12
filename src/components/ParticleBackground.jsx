import React, { useEffect, useRef } from 'react';

// Particle class definition outside component
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        // Store original position for spring effect
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = this.getColor();
    }

    getColor() {
        const colors = [
            'rgba(255, 204, 0, 0.8)',   // Primary yellow
            'rgba(255, 204, 0, 0.5)',   // Light yellow
            'rgba(255, 165, 0, 0.7)',   // Orange
            'rgba(255, 215, 50, 0.6)',  // Golden yellow
            'rgba(0, 229, 255, 0.6)',   // Accent blue (cyan)
            'rgba(0, 191, 255, 0.5)',   // Light blue
            'rgba(135, 206, 250, 0.4)', // Sky blue
            'rgba(255, 255, 255, 0.4)', // White
            'rgba(200, 200, 255, 0.3)', // Light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Spring force to return to original position (creates wobble)
        const springStrength = 0.01; // Adjust for stronger/weaker spring
        const damping = 0.92; // Damping to prevent infinite oscillation

        const dx = this.originalX - this.x;
        const dy = this.originalY - this.y;

        // Apply spring force
        this.speedX += dx * springStrength;
        this.speedY += dy * springStrength;

        // Cursor repulsion
        if (mouse.x !== null && mouse.y !== null) {
            const mdx = this.x - mouse.x;
            const mdy = this.y - mouse.y;
            const distance = Math.sqrt(mdx * mdx + mdy * mdy);
            const maxDistance = 150;

            if (distance < maxDistance) {
                // Hyperactive behavior - stronger repulsion when close
                const force = (maxDistance - distance) / maxDistance;
                const angle = Math.atan2(mdy, mdx);
                const repulsionStrength = 5 * force;

                this.speedX += Math.cos(angle) * repulsionStrength;
                this.speedY += Math.sin(angle) * repulsionStrength;

                // Add some randomness for "hyperactive" effect
                this.speedX += (Math.random() - 0.5) * force * 2;
                this.speedY += (Math.random() - 0.5) * force * 2;
            }
        }

        // Apply damping for wobble effect
        this.speedX *= damping;
        this.speedY *= damping;

        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Limit speed
        const maxSpeed = 8;
        const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
        if (speed > maxSpeed) {
            this.speedX = (this.speedX / speed) * maxSpeed;
            this.speedY = (this.speedY / speed) * maxSpeed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        const particleCount = 240;
        particlesRef.current = [];
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(new Particle(canvas.width, canvas.height));
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections between nearby particles
            particlesRef.current.forEach((particle, index) => {
                for (let j = index + 1; j < particlesRef.current.length; j++) {
                    const other = particlesRef.current[j];
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(255, 204, 0, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            });

            // Update and draw particles
            particlesRef.current.forEach(particle => {
                particle.update(mouseRef.current);
                particle.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: null, y: null };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleBackground;
