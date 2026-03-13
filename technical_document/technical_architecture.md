Core Stack

Desktop Framework: Tauri v2 – Used to build the native, cross-platform desktop application shell with a Rust backend.

Frontend Framework: React 19 with TypeScript – Provides a component-driven, strongly-typed UI architecture.

Build Tool: Vite – Ensures fast, optimized frontend building and Development Server.
Graphics, 3D & Animation

3D Rendering: Three.js integrated via React Three Fiber and React Three Drei – Used for rendering the 3D Moon scenes and objects.

Particle Effects: tsParticles (@tsparticles/react) – Used for generating complex background particle effects (like a starfield).

Animations: GSAP – Handles advanced, smooth UI micro-animations and timeline transitions.
State & Media Management

State Management: Zustand – A lightweight, fast state management library used to handle app data (like memories and pet states).

Audio Processing: Howler.js – Manages robust audio playback (used for the Music Player feature).

Backend (Tauri/Rust)

Language: Rust – Handles system-level operations, native window management, and custom commands (via src-tauri).

Communication: Facilitates IPC (Inter-Process Communication) between the React UI and the native OS.