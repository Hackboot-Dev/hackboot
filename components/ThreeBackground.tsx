'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  const particlesCount = 2000
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [particlesCount])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (ref.current) {
      ref.current.rotation.x = time * 0.05
      ref.current.rotation.y = time * 0.075

      const positions = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]

        positions[i3 + 1] = y + Math.sin(time + x) * 0.001
        positions[i3] = x + Math.cos(time + y) * 0.001
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9333ea"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const gridSize = 50

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const wave1 = Math.sin(x * 0.5 + time) * 0.1
        const wave2 = Math.cos(y * 0.5 + time * 0.8) * 0.1
        positions.setZ(i, wave1 + wave2)
      }
      positions.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[20, 20, gridSize, gridSize]} />
      <meshBasicMaterial
        color="#7c3aed"
        wireframe
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function FloatingOrbs() {
  const orbs = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
      radius: 0.1 + Math.random() * 0.2,
      color: i % 2 === 0 ? '#9333ea' : '#7c3aed',
    }))
  }, [])

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </>
  )
}

function FloatingOrb({
  position,
  speed,
  radius,
  color,
  index,
}: {
  position: [number, number, number]
  speed: number
  radius: number
  color: string
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * speed + index) * 2
      meshRef.current.position.x = position[0] + Math.cos(time * speed * 0.5 + index) * 2
      meshRef.current.scale.setScalar(1 + Math.sin(time * speed * 2 + index) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField />
        <WaveGrid />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
