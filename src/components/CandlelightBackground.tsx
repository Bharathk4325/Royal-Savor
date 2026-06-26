import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface FloatingOrb {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  xRange: number[];
  yRange: number[];
  opacityRange: number[];
  blur: string;
}

const ORBS: FloatingOrb[] = [
  {
    id: 1,
    size: 450,
    left: '5%',
    top: '15%',
    duration: 38,
    delay: 0,
    xRange: [0, 100, -50, 0],
    yRange: [0, -80, 60, 0],
    opacityRange: [0.18, 0.28, 0.14, 0.18],
    blur: 'blur-3xl',
  },
  {
    id: 2,
    size: 550,
    left: '55%',
    top: '45%',
    duration: 45,
    delay: 3,
    xRange: [0, -110, 70, 0],
    yRange: [0, 90, -70, 0],
    opacityRange: [0.12, 0.22, 0.09, 0.12],
    blur: 'blur-[90px]',
  },
  {
    id: 3,
    size: 380,
    left: '35%',
    top: '8%',
    duration: 32,
    delay: 6,
    xRange: [0, 80, -40, 0],
    yRange: [0, 70, -60, 0],
    opacityRange: [0.1, 0.18, 0.08, 0.1],
    blur: 'blur-[110px]',
  },
];

// Seed 18 persistent rising dust ember particles for high-fidelity ambient depth
const DUST_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3.5 + 1.5, // 1.5px to 5px
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: Math.random() * 18 + 14, // 14s to 32s
  delay: Math.random() * -20, // Negative delay to pre-populate on initial render
  xDrift: Math.random() * 60 - 30,
}));

export default function CandlelightBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);

  // Smooth mouse coordinates utilizing Framer Motion's high-speed Spring system (bypasses React state loop for 60fps)
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const springConfig = { damping: 30, stiffness: 80, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Offset by 150px to center the 300px tracking glow
      mouseX.set(event.clientX - 150);
      mouseY.set(event.clientY - 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch (e) {
      console.warn('WebGL initialization failed', e);
    }

    if (!gl) {
      setWebglError(true);
      return;
    }

    // Resize handling
    const syncSize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (gl) gl.viewport(0, 0, w, h);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => syncSize());
      resizeObserver.observe(containerRef.current);
    }
    syncSize();

    // Shaders compilation
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float bokeh(vec2 uv, vec2 pos, float size) {
          float d = distance(uv, pos);
          float glow = exp(-d * d * 50.0);
          float circle = smoothstep(size, size - 0.01, d);
          return mix(glow, circle * 0.5, 0.5);
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 mouse = u_mouse / u_resolution;
          
          vec2 pUv = uv;
          pUv.x *= u_resolution.x / u_resolution.y;
          
          float flicker = snoise(vec2(u_time * 0.5, 0.0)) * 0.08 + 0.92;
          
          float l1 = smoothstep(0.3, 0.8, sin(uv.x * 2.0 + u_time * 0.2 + uv.y) * 0.5 + 0.5);
          float l2 = smoothstep(0.2, 0.9, cos(uv.y * 1.5 - u_time * 0.15 - uv.x) * 0.5 + 0.5);
          float beam = l1 * l2;
          
          float particles = 0.0;
          for(int i=0; i<8; i++) {
              float fi = float(i);
              vec2 pos = vec2(
                  sin(fi * 1.3 + u_time * 0.1) * 0.4 + 0.5,
                  cos(fi * 1.7 + u_time * 0.15) * 0.4 + 0.5
              );
              pos.x *= u_resolution.x / u_resolution.y;
              float size = 0.02 + sin(fi * 2.0 + u_time * 0.5) * 0.01;
              particles += bokeh(pUv, pos, size) * (0.5 + 0.5 * sin(u_time + fi));
          }
          
          float atmos = snoise(uv * 2.0 + u_time * 0.03);
          
          vec3 charcoal = vec3(0.075, 0.075, 0.075);
          vec3 gold = vec3(0.83, 0.69, 0.22);
          
          float dist = distance(uv, mouse);
          float glow = smoothstep(0.6, 0.0, dist) * 0.4;
          
          vec3 color = mix(charcoal, charcoal * 1.2, atmos * 0.5 + 0.5);
          color += gold * beam * 0.15 * flicker;
          color += gold * particles * 0.3 * flicker;
          color += gold * glow;
          
          float vignette = 1.0 - distance(uv, vec2(0.5)) * 0.8;
          color *= vignette;

          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setWebglError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      setWebglError(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = (time: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#131313] overflow-hidden select-none">
      {/* 1. Underlying WebGL Canvas or fallback candlelight gradient */}
      {webglError ? (
        <div className="absolute inset-0 w-full h-full bg-[#131313]">
          <div 
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen animate-[pulse_6s_infinite_alternate]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(19, 19, 19, 0.95) 75%)'
            }}
          />
        </div>
      ) : (
        <canvas ref={canvasRef} className="block w-full h-full absolute inset-0" />
      )}

      {/* 2. Interactive Spring-Trailing Cursor Halo (Motion Visual Effect) */}
      <motion.div
        className="absolute rounded-full pointer-events-none bg-radial from-[#f2ca50]/7 to-transparent blur-[80px]"
        style={{
          width: 300,
          height: 300,
          x: cursorX,
          y: cursorY,
        }}
      />

      {/* 3. Slow-Drifting Luxury Golden Ambient Orbs */}
      {ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full pointer-events-none ${orb.blur}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            background: 'radial-gradient(circle, rgba(242, 175, 55, 0.09) 0%, rgba(242, 175, 55, 0) 70%)',
          }}
          animate={{
            x: orb.xRange,
            y: orb.yRange,
            opacity: orb.opacityRange,
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 4. Rising Ember / Golden Dust Particles with organic micro-physics */}
      {DUST_PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none bg-[#f2ca50]/50"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
            opacity: 0,
            filter: 'drop-shadow(0 0 3px rgba(242, 202, 80, 0.4))',
          }}
          animate={{
            y: [200, -600],
            x: [0, particle.xDrift, -particle.xDrift, 0],
            opacity: [0, 0.3, 0.5, 0.1, 0],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* 5. Rich Multiplicative Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#131313_130%)] mix-blend-multiply opacity-60 pointer-events-none" />
    </div>
  );
}
