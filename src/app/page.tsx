'use client'
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusGeometry, ShaderMaterial } from "three";
import { Text } from "@react-three/drei";

// 毛玻璃甜甜圈组件
function FrostedGlassDonut() {
  // 创建甜甜圈几何体
  const geometry = new TorusGeometry(2, 0.5, 100, 100);

  // 创建毛玻璃着色器材质
  const material = new ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      blurSize: { value: 0.005 }, // 模糊程度
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float blurSize;
      varying vec2 vUv;
      void main() {
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        for (float i = -5.0; i <= 5.0; i++) {
          for (float j = -5.0; j <= 5.0; j++) {
            vec2 offset = vec2(i * blurSize, j * blurSize);
            color += texture2D(tDiffuse, vUv + offset);
          }
        }
        gl_FragColor = color / 121.0;
      }
    `,
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      scale={1.5}
      renderOrder={-1} // 调整渲染顺序，确保甜甜圈先被渲染
    />
  );
}

// 文字组件
function TextComponent() {
  return (
    <Text
      fontSize={1.2}
      color="white"
      anchorY="middle"
      anchorX="left"
      fontWeight="bold"
      position={[0, 0, -2]} // 确保文字在甜甜圈后面
      renderOrder={1} // 调整渲染顺序，确保文字后被渲染
    >
      Hello, Frosted Glass!
    </Text>
  );
}

// 主场景组件
function Scene() {
  const donutRef = useRef();

  useFrame(() => {
    if (donutRef.current) {
      donutRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {/* 添加背景灯光 */}
      <ambientLight intensity={0.3} />

      {/* 添加定向灯光 */}
      <directionalLight position={[-10, 0, -10]} intensity={1.2} />
      <directionalLight position={[10, 0, 10]} intensity={1.2} />

      {/* 添加点光源 */}
      <pointLight position={[20, 20, 20]} intensity={0.8} />

      {/* 毛玻璃甜甜圈 */}
      <FrostedGlassDonut ref={donutRef} position={[0, 0, 0]} />

      {/* 文字 */}
      <TextComponent />
    </>
  );
}

// 主页面
export default function Home() {
  return (
    <div className="scene-container w-screen h-screen">
      <Canvas style={{ background: "#000" }}>
        <Scene />
      </Canvas>
    </div>
  );
}