"use client";

export default function Sprinkles() {
    return (
        <>
            {[...Array(20)].map((_, i) => {
                // Use deterministic values based on index
                const seed = i * 137.508; // Golden angle approximation
                // Round to 2 decimal places for consistency
                const left = Number((((Math.sin(seed) * 0.5 + 0.5) * 100) % 100).toFixed(2));
                const top = Number((((Math.cos(seed * 0.7) * 0.5 + 0.5) * 100) % 100).toFixed(2));
                const delay = Number(((Math.sin(seed * 1.3) * 0.5 + 0.5) * 2).toFixed(2));
                const duration = Number((2 + ((Math.cos(seed * 0.9) * 0.5 + 0.5) * 2)).toFixed(2));
                
                return (
                    <div
                        key={`sprinkle-${i}`}
                        className="absolute w-2 h-2 rounded-full animate-twinkle"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            backgroundColor: ['#FF6B9D', '#FFB6C1', '#FFD700', '#FFA500', '#FF69B4'][i % 5],
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                        }}
                    />
                );
            })}
        </>
    );
}

