'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HotelHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060d17, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 7);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Luxury Hotel Architectural Composition (Glass & Gold Monoliths + Ambient Rings)
    const group = new THREE.Group();
    scene.add(group);

    // Central Glass Tower
    const towerGeo = new THREE.BoxGeometry(1.6, 4.2, 1.6);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a5f,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 1.2,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.92,
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 0, 0);
    group.add(tower);

    // Golden Architectural Accents (Wireframe / Ribs)
    const edges = new THREE.EdgesGeometry(towerGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      linewidth: 2,
      transparent: true,
      opacity: 0.7,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    tower.add(wireframe);

    // Flanking Lower Modern Wing (Right)
    const wingRightGeo = new THREE.BoxGeometry(1.2, 2.6, 1.2);
    const wingRightMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f2744,
      metalness: 0.5,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const wingRight = new THREE.Mesh(wingRightGeo, wingRightMat);
    wingRight.position.set(1.6, -0.8, -0.4);
    group.add(wingRight);
    wingRight.add(new THREE.LineSegments(new THREE.EdgesGeometry(wingRightGeo), lineMat));

    // Flanking Lower Modern Wing (Left)
    const wingLeftGeo = new THREE.BoxGeometry(1.2, 2.0, 1.2);
    const wingLeft = new THREE.Mesh(wingLeftGeo, wingRightMat);
    wingLeft.position.set(-1.6, -1.1, -0.3);
    group.add(wingLeft);
    wingLeft.add(new THREE.LineSegments(new THREE.EdgesGeometry(wingLeftGeo), lineMat));

    // Floating Golden Luxury Rings / Halos
    const ringGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.35 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.y = -0.5;
    group.add(ring);

    // Secondary Floating Ring
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.015, 16, 100), ringMat);
    ring2.rotation.x = Math.PI / 2.6;
    ring2.rotation.y = Math.PI / 8;
    ring2.position.y = 0.5;
    group.add(ring2);

    // Warm Ambient Particles (representing city night luxury lights)
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd4af37, 3, 15);
    goldLight.position.set(3, 4, 4);
    scene.add(goldLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2, 12);
    blueLight.position.set(-4, -2, 2);
    scene.add(blueLight);

    // 6. Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth) * 2 - 1;
      mouseY = -(e.clientY / innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp rotation with mouse
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

      // Subtle continuous idle rotation & floating
      group.rotation.y += 0.003;
      group.position.y = Math.sin(elapsedTime * 0.8) * 0.08;

      ring.rotation.z += 0.002;
      ring2.rotation.z -= 0.0025;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      towerGeo.dispose();
      towerMat.dispose();
      wingRightGeo.dispose();
      wingRightMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      aria-hidden="true"
    />
  );
}

