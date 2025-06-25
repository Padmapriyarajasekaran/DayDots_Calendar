// components/BackgroundLayers.tsx
'use client'

import Particles from 'react-tsparticles'

export default function BackgroundLayers() {
  return (
    <>
      {/* 🔮 Animated Gradient Background */}
      <div className="fixed inset-0 -z-20 bg-animated-gradient bg-400 animate-gradient-x dark:from-black dark:via-gray-900 dark:to-gray-800" />

      {/* 🌟 Particle Layer */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },
          style: {
            position: 'fixed',
            top:"0",
            left:"0",
            width: '100%',
            height: '100%',
            zIndex: '-10',
          },
          particles: {
            number: { value: 60 },
            color: {
              value: ['#ffffff', '#00e1ff', '#ff7ee9', '#8aff00'],
            },
            shape: {
              type: ['circle', 'star', 'triangle'],
            },
            opacity: {
              value: 0.6,
              random: true,
            },
            size: {
              value: { min: 2, max: 4 },
              random: true,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            links: {
              enable: true,
              distance: 120,
              color: '#ccc',
              opacity: 0.4,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              onClick: {
                enable: true,
                mode: 'push',
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 100,
              },
              push: {
                quantity: 4,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </>
  )
}
