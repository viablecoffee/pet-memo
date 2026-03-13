# Project Initialization Guide

This guide provides step-by-step instructions to initialize the `memory-moon` technical architecture (Vite + React + TypeScript + Tauri v2) from scratch.

## 1. Initialize Frontend (Vite + React + TypeScript)

Create a new Vite project using the React and TypeScript template:

```bash
npm create vite@latest your-project-name -- --template react-ts
cd your-project-name
npm install
```

## 2. Install Core Dependencies

Install the graphics, animations, and state management dependencies required for the project:

```bash
# 3D rendering and graphics
npm install three @react-three/fiber @react-three/drei

# Particle effects
npm install tsparticles @tsparticles/react

# Animations, state management, and audio processing
npm install gsap zustand howler
```

## 3. Initialize Tauri Backend (v2)

Set up Tauri as the desktop application container:

```bash
# Install Tauri v2 CLI as a dev dependency
npm install -D @tauri-apps/cli@^2

# Initialize the Tauri project (this creates the `src-tauri` folder)
npx tauri init
```

*When prompted during `npx tauri init`, provide the following answers:*
- **What is your app name?** `memory-moon` (or your preferred name)
- **What should the window title be?** `Memory Moon`
- **Where are your web assets (HTML/CSS/JS) located?** `../dist`
- **What is the url of your dev server?** `http://localhost:1420` (or the default `http://localhost:5173`)
- **What is your frontend dev command?** `npm run dev`
- **What is your frontend build command?** `npm run build`

## 4. Install Tauri API and Plugins

Install the required Tauri frontend API libraries to allow React to communicate with the Rust backend:

```bash
npm install @tauri-apps/api@^2.10.1 @tauri-apps/plugin-opener@^2
```

## 5. Start the Application

Once the setup is complete, you can start the development server and open the application in the Tauri desktop window:

```bash
npm run tauri dev
```