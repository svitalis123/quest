# Quest Learner Readiness Platform: A Comprehensive Frontend Engineering Framework

The **Quest Post-School Success Platform (PSSP)** represents a sophisticated intersection of advanced frontend engineering, behavioral psychology, and the pan-African educational vision of **Nova Pioneer**. As the digital manifestation of three distinct programmatic streams—Post School Prep (PSP), The Graduate Platform (TGP), and Innovator Pathways (IP)—the Quest interface serves as a high-stakes "cockpit and coach" for learners navigating the transition from secondary education to university and the professional world.

This repository contains the source for the Learner Readiness Application, a mobile-first experience designed specifically for 15-to-18-year-old students in Kenya.

##  Video Walkthrough
[Watch the walkthrough on Loom](https://www.loom.com/share/48d7b8a595a544db8276dded89a30d09)

---

##  Socio-Technical Context: The Kenyan Learner

The successful implementation of this platform depends fundamentally on a nuanced understanding of the end-user’s environment.

### Mobile Usage & Psychological Correlates
*   **High Mobile Engagement**: Kenyan "Generation Z" adolescents spend 4-7 hours daily on devices.
*   **Educational Utility**: Significant trend toward using smartphones for learning materials and collaboration.
*   **Self-Efficacy Link**: Strong positive correlation (0.985) between mobile usage and personal growth.
*   **Cognitive Load**: High prevalence of ADHD symptoms necessitates a UI that is exceptionally clear and avoids cognitive overload.

### Connectivity & Infrastructure
*   **Internet Penetration**: 87.2% reach, but often with uneven access in rural areas.
*   **Data Constraints**: A mobile-first architecture optimized for performance and data efficiency is mandatory.

---

##  Nova Pioneer Culture Principles

The Quest platform is an extension of the Nova Pioneer culture. Every component reinforces these core values:

| Culture Principle | UI Implementation Strategy | Cognitive Goal |
| :--- | :--- | :--- |
| **Joy of Learning** | Micro-interactions and playful visual rewards. | Foster curiosity and positive engagement. |
| **Greater Together** | Community benchmarks and collaborative toolkits. | Build a sense of collective progress. |
| **Always Growing** | Dynamic progress tracking and growth-mindset feedback. | Encourage resilience and life-long learning. |
| **Servant Leadership** | Profile sections highlighting community impact. | Promote humility and mission-driven leadership. |
| **Solutions First** | Action-oriented recommendations for every data point. | Develop critical thinking and problem-solving skills. |
| **High Expectations** | Professional-grade data visualization. | Instill pride and drive for excellence. |

---

##  Visual Identity and Design System

The visual language is a contemporary interpretation of the Nova Pioneer brand, optimized for digital legibility and psychological engagement.

### Color Palette
*   **Typography Base**: `#1E3F75` (Deep Navy Blue) - Authority, Primary UI.
*   **Section Titles**: `#1E3A77` (Navy Blue) - Hierarchy, Focus.
*   **Button Primary**: `#ffd100` (Vibrant Gold) - Action, Energy.
*   **Button Hover**: `#1F3A77` (Dark Navy) - Active State.
*   **Descriptions**: `#9b9b9b` (Grey) - Secondary Info.
*   **Links**: `#4a4a4a` (Dark Grey) - Utility, Navigation.

### Status Indicators (RAG System)
*   🟢 **High / Ready**: `#42C842` (Scores > 80%)
*   🟡 **Mid / Growth**: `#DADA93` (Scores 60-80%)
*   🟠 **Low / Focus**: `#E1943C` (Scores < 60%)

### Typography & Spacing
*   **Fonts**: Bold, sans-serif fonts for primary metrics.
*   **Grid**: 8px grid system to maintain visual rhythm and touch-friendly spacing.

---

##  Technical Architecture

This project is built with **Next.js** (React) and **TypeScript**, utilizing a modular, component-based architecture.

### Tech Stack
*   **Framework**: [Next.js](https://nextjs.org/) (App Router) for SSG/SSR and performance.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and data contracts.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
*   **Icons**: [Lucide React](https://lucide.dev/).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for gestures, transitions, and micro-interactions.
*   **Charts**: [Recharts](https://recharts.org/) for data visualization.

### Architecture Layers
1.  **Service Layer**: Data orchestration and custom React hooks (consuming JSON/API).
2.  **State Management Layer**: React Context API for global learner data.
3.  **UI Component Library**: Atomic components (Buttons, Cards) styled with Tailwind.
4.  **View Layer**: Assembly of components into key screens (Dashboard, Detailed Skill View).

### Type Definitions
Key interfaces (e.g., `ReadinessData`, `SkillArea`) define the shape of learner data, ensuring strict contracts between valid data and the UI.

---

##  Key Features

### 1. The Readiness Overview
*   **Circular Gauge**: Visualizes the weighted average score.
*   **Human-Readable Interpretation**: Dynamic feedback text based on score thresholds (>80%, 60-80%, <60%).

### 2. Skill Area Breakdown
*   **Dimensions**: Academics, Career Skills, Life Skills, Entrepreneurship.
*   **Visuals**: Progress bars, Strength/Growth badges, and trend mini-charts.
*   **Radar Chart**: Toggleable view to show the "balance" of a student's profile.

### 3. Insight & Recommendation Engine
*   **Action Cards**: Personalized advice based on identified patterns.
*   **Interactive CTAs**: Gold-to-Navy hover transitions to encourage action.

---

## Getting Started

This is a [Next.js](https://nextjs.org/) project.

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Interaction Design (Mobile-First)

*   **Gestures**: Lightweight animations using Framer Motion.
*   **Touch Targets**: Minimum 48x48 pixels for accessibility.
*   **Accessibility**: WCAG AA compliant contrast ratios (e.g., `#1E3F75` text on white).

---

##  Project Structure

```
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components
│   ├── features/         # Feature-specific components (CoachCard, etc.)
│   ├── ui/               # Atomic components (shadcn/ui or custom)
│   └── ...
├── context/              # React Context providers (ReadinessContext)
├── services/             # Data fetching and business logic
│   ├── data/             # Dummy JSON data for development
│   └── ...
├── types/                # TypeScript interfaces and types
├── public/               # Static assets
└── ...
```

---

##  Performance Strategy

*   **Next.js Image Optimization**: Automatic resizing and lazy-loading.
*   **Bundle Splitting**: Dynamic imports for screen-specific code.
*   **Lightweight Charting**: Optimized use of Recharts for small bundle size.
