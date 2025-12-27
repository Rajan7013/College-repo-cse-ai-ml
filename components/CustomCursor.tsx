'use client';

import { useEffect, useState } from 'react';

interface Ripple {
    x: number;
    y: number;
    id: number;
}

interface Particle {
    x: number;
    y: number;
    id: number;
    color: string;
    size: number;
    velocityX: number;
    velocityY: number;
}

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Particle colors
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#06B6D4', '#EC4899'];

    useEffect(() => {
        let particleInterval: NodeJS.Timeout;

        const updateCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null
            );
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Create particle trail
            if (Math.random() > 0.7) { // 30% chance per move
                const newParticle: Particle = {
                    x: e.clientX,
                    y: e.clientY,
                    id: Date.now() + Math.random(),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 4 + 2,
                    velocityX: (Math.random() - 0.5) * 2,
                    velocityY: (Math.random() - 0.5) * 2 - 1,
                };

                setParticles(prev => [...prev, newParticle]);

                setTimeout(() => {
                    setParticles(prev => prev.filter(p => p.id !== newParticle.id));
                }, 1000);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsClicking(true);

            // Create ripple effect
            const newRipple: Ripple = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now(),
            };

            setRipples(prev => [...prev, newRipple]);

            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }, 800);

            // Burst of particles on click
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const velocity = 3;
                const newParticle: Particle = {
                    x: e.clientX,
                    y: e.clientY,
                    id: Date.now() + i + Math.random(),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 3 + 2,
                    velocityX: Math.cos(angle) * velocity,
                    velocityY: Math.sin(angle) * velocity,
                };

                setParticles(prev => [...prev, newParticle]);

                setTimeout(() => {
                    setParticles(prev => prev.filter(p => p.id !== newParticle.id));
                }, 800);
            }
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', updateCursor);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updateCursor);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            if (particleInterval) clearInterval(particleInterval);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="fixed pointer-events-none z-[9995] hidden md:block"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        transform: 'translate(-50%, -50%)',
                        animation: `particle-float 1s ease-out forwards`,
                        '--particle-vx': `${particle.velocityX}px`,
                        '--particle-vy': `${particle.velocityY}px`,
                    } as React.CSSProperties}
                >
                    <div
                        className="rounded-full blur-sm"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                        }}
                    />
                </div>
            ))}

            {/* Click Ripples */}
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="fixed pointer-events-none z-[9996] hidden md:block animate-ripple"
                    style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div className="w-0 h-0 rounded-full border-2 border-blue-400 animate-ping-once"
                        style={{
                            animation: 'ripple-expand 0.8s ease-out forwards',
                        }}
                    />
                </div>
            ))}

            {/* Spotlight/Flashlight Effect */}
            <div
                className="fixed pointer-events-none z-[9997] hidden md:block"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.15s ease-out',
                }}
            >
                <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 blur-3xl" />
            </div>

            {/* Medium glow */}
            <div
                className="fixed pointer-events-none z-[9997] hidden md:block"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.2s ease-out',
                }}
            >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500/20 via-blue-500/15 to-purple-500/20 blur-2xl" />
            </div>

            {/* Main cursor dot */}
            <div
                className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'transform 0.1s ease-out',
                }}
            >
                <div
                    className={`rounded-full bg-white transition-all duration-200 ${isClicking ? 'w-1.5 h-1.5' : isPointer ? 'w-3 h-3' : 'w-2 h-2'
                        }`}
                />
            </div>

            {/* Outer ring */}
            <div
                className="fixed pointer-events-none z-[9998] mix-blend-difference hidden md:block"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
            >
                <div
                    className={`rounded-full border-2 border-white transition-all duration-300 ${isClicking
                        ? 'w-8 h-8 border-purple-400 bg-purple-400/20'
                        : isPointer
                            ? 'w-12 h-12 border-blue-400 bg-blue-400/10'
                            : 'w-10 h-10'
                        }`}
                />
            </div>

            <style jsx global>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
          }
        }

        @keyframes particle-float {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--particle-vx, 0), var(--particle-vy, -30px)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
        </>
    );
}
