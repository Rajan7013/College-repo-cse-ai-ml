'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
    '/hero-3d-1.png',
    '/hero-3d-2.png',
    '/hero-3d-3.png',
];

export default function HeroImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3300); // Change image every 3.3 seconds (all 3 in ~10 seconds)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full">
            {images.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Digital Library Illustration ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority={index === 0}
                    />
                </div>
            ))}
        </div>
    );
}
