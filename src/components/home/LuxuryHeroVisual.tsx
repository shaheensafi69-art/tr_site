'use client';

import React from 'react';
import Image from 'next/image';

interface LuxuryHeroVisualProps {
  coverImage?: string;
}

export default function LuxuryHeroVisual({ coverImage }: LuxuryHeroVisualProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Background Luxury Ambience Image directly from Database */}
      {coverImage && (
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <Image
            src={coverImage}
            alt="نمای لوکس هتل تابان تهران‌روم"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
        </div>
      )}

      {/* Dark Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/80 to-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-[#030712]/90" />

      {/* Soft Luminous Glow Blobs (pure CSS, GPU-accelerated) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent blur-[140px] rounded-full" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-amber-400/10 blur-[130px] rounded-full" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-yellow-500/10 blur-[130px] rounded-full" />

      {/* Subtle Golden Geometric Lines */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </div>
  );
}

