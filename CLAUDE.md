# Algoscope Project Memory

## Overview
Algoscope is a premium algorithm visualizer built with React, Vite, and Framer Motion. It focuses on high-fidelity, cinematic visualizations of common data structures and algorithms.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **State Management**: Zustand (`useStore`).
- **Data**: JSON-based problem definitions in `frontend/src/data/problems.json`.

## Core Components
- `MatrixEngine.tsx`: Visualizes 2D array and matrix algorithms.
- `GraphVisualizer.tsx`: Handles graph-based algorithms.
- `StateTracker.tsx`: Displays the live execution state (pointers, variables) of an algorithm.
- `SortingEngine.tsx`: Visualizes sorting patterns.

## Development Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build for production.
- `npm test`: Run tests (if applicable).

## Coding Standards
- Use **premium aesthetics** (glassmorphism, vibrant gradients, smooth transitions).
- Follow **Single Responsibility Principle** for engines.
- Ensure **accessibility** and **SEO** best practices are met in components.
- Standardize problem data to include `brute_force_explanation`, `optimal_explanation`, `pseudocode`, and `efficiency`.

## Project Structure
- `frontend/src/visualization-engines/`: Core logic for different algorithm types.
- `frontend/src/components/problem/`: UI components for problem description and state.
- `frontend/src/store/`: Zustand store for global state.
- `backend/`: Node.js backend (if present).
