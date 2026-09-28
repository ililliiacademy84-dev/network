import React, { useEffect, useRef, useState } from 'react';

interface ThreeDHeroHeadlineProps {
  className?: string;
}

const TECHNICAL_CHARSET = '!@#$%&*+=<>/\_|_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Hook for progressive left-to-right character decoding with a smooth continuous loop
const useTextScramble = (
  targetText: string, 
  startDelayMs: number = 0, 
  isReducedMotion: boolean = false,
  pauseAfterResolveMs: number = 4200
) => {
  const [displayText, setDisplayText] = useState<string>(isReducedMotion ? targetText : '');
  const [isResolved, setIsResolved] = useState<boolean>(isReducedMotion);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayText(targetText);
      setIsResolved(true);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    const durationPerCharMs = 45; // Speed of left-to-right decode step
    const decodeTimeMs = targetText.length * durationPerCharMs;
    const cycleTotalDurationMs = 7000; // Synchronized total cycle duration for all lines

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const rawElapsed = timestamp - startTime;
      const cycleElapsed = rawElapsed % cycleTotalDurationMs;

      const resolveTime = startDelayMs + decodeTimeMs;

      // Phase 1: Resolved and held cleanly so text is readable
      if (cycleElapsed >= resolveTime) {
        setDisplayText(targetText);
        setIsResolved(true);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      setIsResolved(false);

      // Phase 2: Initial start delay for line
      if (cycleElapsed < startDelayMs) {
        let scrambled = '';
        for (let i = 0; i < targetText.length; i++) {
          const char = targetText[i];
          if (char === ' ' || char === '.') {
            scrambled += char;
          } else {
            scrambled += TECHNICAL_CHARSET[Math.floor(Math.random() * TECHNICAL_CHARSET.length)];
          }
        }
        setDisplayText(scrambled);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Phase 3: Active left-to-right character decoding
      const activeElapsed = cycleElapsed - startDelayMs;
      let result = '';

      for (let i = 0; i < targetText.length; i++) {
        const char = targetText[i];
        if (char === ' ') {
          result += ' ';
          continue;
        }

        const lockTime = i * durationPerCharMs;
        if (activeElapsed >= lockTime) {
          result += char;
        } else {
          result += TECHNICAL_CHARSET[Math.floor(Math.random() * TECHNICAL_CHARSET.length)];
        }
      }

      setDisplayText(result);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetText, startDelayMs, isReducedMotion, pauseAfterResolveMs]);

  return { displayText, isResolved };
};

export const ThreeDHeroHeadline: React.FC<ThreeDHeroHeadlineProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontLayerRef = useRef<HTMLDivElement>(null);
  const depthLayerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Synchronized staggered looping text scramble hooks
  const line1 = useTextScramble('DESIGN.', 150, prefersReducedMotion);
  const line2 = useTextScramble('CONFIGURE.', 400, prefersReducedMotion);
  const line3 = useTextScramble('SIMULATE THE FUTURE.', 750, prefersReducedMotion);

  // Motion physics targets & current interpolated values for magnetic mouse movement
  const targetMotion = useRef({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    isHovered: false
  });

  const currentMotion = useRef({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1
  });

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    // Smooth 60/120fps requestAnimationFrame lerp loop
    const updateMotionLoop = () => {
      if (!mediaQuery.matches) {
        const ease = 0.08; // Spring-like smooth dampening
        const target = targetMotion.current;
        const current = currentMotion.current;

        current.x += (target.x - current.x) * ease;
        current.y += (target.y - current.y) * ease;
        current.rotateX += (target.rotateX - current.rotateX) * ease;
        current.rotateY += (target.rotateY - current.rotateY) * ease;
        current.scale += (target.scale - current.scale) * ease;

        // Apply 3D transforms to front layer (100% parallax + translateZ)
        if (frontLayerRef.current) {
          frontLayerRef.current.style.transform = `
            translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 24px)
            rotateX(${current.rotateX.toFixed(2)}deg)
            rotateY(${current.rotateY.toFixed(2)}deg)
            scale(${current.scale.toFixed(3)})
          `;
        }

        // Apply 3D transforms to depth layer (70% parallax)
        if (depthLayerRef.current) {
          depthLayerRef.current.style.transform = `
            translate3d(${(current.x * 0.7).toFixed(2)}px, ${(current.y * 0.7).toFixed(2)}px, 8px)
            rotateX(${(current.rotateX * 0.7).toFixed(2)}deg)
            rotateY(${(current.rotateY * 0.7).toFixed(2)}deg)
            scale(${(1 + (current.scale - 1) * 0.7).toFixed(3)})
          `;
        }

        // Apply 3D transforms to ambient glow layer (40% parallax)
        if (glowLayerRef.current) {
          glowLayerRef.current.style.transform = `
            translate3d(${(current.x * 0.4).toFixed(2)}px, ${(current.y * 0.4).toFixed(2)}px, 0px)
            rotateX(${(current.rotateX * 0.4).toFixed(2)}deg)
            rotateY(${(current.rotateY * 0.4).toFixed(2)}deg)
          `;
        }
      }

      animationFrameId.current = requestAnimationFrame(updateMotionLoop);
    };

    animationFrameId.current = requestAnimationFrame(updateMotionLoop);

    // Global hero mouse listener with touch device check
    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch gestures to avoid layout shift on mobile
      if (e.pointerType === 'touch') return;
      if (mediaQuery.matches) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      const magneticRadius = Math.max(window.innerWidth * 0.6, 500);

      if (distance < magneticRadius) {
        // Calculate normalized ratios (-1 to +1)
        const normX = Math.max(-1, Math.min(1, distX / (window.innerWidth * 0.5)));
        const normY = Math.max(-1, Math.min(1, distY / (window.innerHeight * 0.5)));

        // Magnetic strength based on proximity to headline
        const proximity = Math.max(0, 1 - distance / magneticRadius);
        const magnetBoost = 1 + proximity * 0.5;

        targetMotion.current = {
          x: normX * 12 * magnetBoost,       // Max ±12px
          y: normY * 10 * magnetBoost,       // Max ±10px
          rotateX: -normY * 3 * magnetBoost, // Max ±3 deg
          rotateY: normX * 4 * magnetBoost,  // Max ±4 deg
          scale: 1 + proximity * 0.02,       // 1.00 -> 1.02 subtle scale
          isHovered: true
        };
      } else {
        // Outside magnetic radius: smoothly return to resting position
        targetMotion.current = {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          isHovered: false
        };
      }
    };

    const handlePointerLeave = () => {
      targetMotion.current = {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        isHovered: false
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="DESIGN. CONFIGURE. SIMULATE THE FUTURE."
      className={`relative select-none pointer-events-none transition-opacity duration-1000 ${
        isMounted ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        perspective: prefersReducedMotion ? 'none' : '1200px',
        perspectiveOrigin: 'center center',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* ── AMBIENT DEPTH GLOW LAYER (40% Motion) ── */}
      {!prefersReducedMotion && (
        <div
          ref={glowLayerRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none -z-10 blur-2xl opacity-40 transition-opacity duration-700"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <div className="w-full h-full bg-gradient-to-r from-[#00ff87]/30 via-[#00e5ff]/25 to-cyan-500/30 rounded-3xl" />
        </div>
      )}

      {/* ── 3D DEPTH OCCLUSION LAYER (70% Motion) ── */}
      {!prefersReducedMotion && (
        <div
          ref={depthLayerRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none -z-5 select-none"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] uppercase text-black/50 blur-[2px] translate-y-1.5 translate-x-1 font-mono">
            <span className="block">{line1.displayText}</span>
            <span className="block">{line2.displayText}</span>
            <span className="block">{line3.displayText}</span>
          </div>
        </div>
      )}

      {/* ── PRIMARY FRONT 3D LAYER (100% Motion & Staggered Entrance + Looping Text Scramble) ── */}
      <div
        ref={frontLayerRef}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase drop-shadow-[0_4px_28px_rgba(0,0,0,1)] font-mono">
          
          {/* Line 1: SECURE AND SMART HARAMAYA UNIVERSITY NETWORK DESIGN. */}
          <span 
            className={`block transition-all duration-700 ease-out ${
              line1.isResolved ? 'text-white' : 'text-[#00ff87] tracking-wider'
            }`}
            style={{
              transform: isMounted || prefersReducedMotion ? 'translateZ(0) rotateX(0deg)' : 'translateZ(-40px) rotateX(8deg)',
              opacity: isMounted || prefersReducedMotion ? 1 : 0,
              transitionDelay: '100ms'
            }}
          >
            {line1.displayText}
          </span>

          {/* Line 2: CONFIGURE. */}
          <span 
            className={`block transition-all duration-700 ease-out ${
              line2.isResolved ? 'text-white' : 'text-[#00e5ff] tracking-wider'
            }`}
            style={{
              transform: isMounted || prefersReducedMotion ? 'translateZ(0) rotateX(0deg)' : 'translateZ(-40px) rotateX(8deg)',
              opacity: isMounted || prefersReducedMotion ? 1 : 0,
              transitionDelay: '250ms'
            }}
          >
            {line2.displayText}
          </span>

          {/* Line 3: SIMULATE THE FUTURE. (Gradient Neon) */}
          <span 
            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] via-[#00e5ff] to-cyan-400 transition-all duration-800 ease-out drop-shadow-[0_2px_18px_rgba(0,255,135,0.4)]"
            style={{
              transform: isMounted || prefersReducedMotion ? 'translateZ(0) rotateX(0deg)' : 'translateZ(-50px) rotateX(10deg)',
              opacity: isMounted || prefersReducedMotion ? 1 : 0,
              transitionDelay: '400ms'
            }}
          >
            {line3.displayText}
          </span>
        </h1>
      </div>
    </div>
  );
};
