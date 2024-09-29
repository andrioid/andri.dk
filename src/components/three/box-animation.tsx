import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";
import { Mesh } from "three";
import { Stats, OrbitControls } from "@react-three/drei";

function Box(props: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh | null>(null);
  /*
  useFrame(() => {
    return;
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
   */
  const [x, y, z] = props.position;

  return (
    <mesh ref={mesh}>
      <boxGeometry attach="geometry" args={[x, y, z]} />
      <meshPhongMaterial />
    </mesh>
  );
}

function SimpleBox() {
  const ref = useRef<Mesh>(null);
  const { mouse } = useThree();

  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.rotation.y = mouse.x * Math.PI * 2;
  //     ref.current.rotation.x = mouse.y * Math.PI * 2;
  //     ref.current.rotation.z = 0;
  //   }
  // });

  return (
    <mesh ref={ref} position={[1, 2, 3]} scale={15}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshPhongMaterial />
    </mesh>
  );
}

export const BoxAnimation = () => {
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const boxes = Array(100)
    .fill(null)
    .map((_, i) => {
      const x = (i % 10) * 2;
      const y = Math.floor(i / 10) * 2;
      return <Box position={[x, y, 4]} key={i} />;
    });
  return (
    <div className="fixed min-w-full min-h-full top-0 left-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        className="h-full"
        //className="min-w-full min-h-full bg-green-100"
        camera={{ fov: 50, position: [0, 0, 20] }}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 10]} color="red" />
        <OrbitControls />
        <SimpleBox />
      </Canvas>
    </div>
  );
};
