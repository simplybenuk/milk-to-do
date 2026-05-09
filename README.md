# Archived

This repository is no longer maintained.

It may contain known security vulnerabilities and should not be used as a dependency, deployed, or copied into production.


# SourList - The Expiring To-Do App

SourList is a modern to-do application where tasks expire after 30 days, helping users prioritize effectively and prevent task accumulation.

## 📱 Live Demo

Visit [sourlist.com](https://sourlist.com) to try the app.

## 🥛 Product Overview

SourList addresses the common problem of traditional to-do lists becoming overwhelming and ineffective over time. By introducing the concept of task expiry, the app encourages timely completion and helps users focus on what truly matters.

### Core Concept

Just like milk in your refrigerator, tasks in SourList have an expiration date. If not completed within 30 days (by default), they go "sour." This creates a natural prioritization system and prevents your to-do list from becoming an ever-growing graveyard of incomplete tasks.

## ✨ Key Features

### Task Expiry System
- Every task expires after 30 days by default
- Visual indicators show task freshness: fresh (new), spoiling (aging), or sour (about to expire)
- Expired tasks are clearly marked but can still be completed or reprioritized

### Smart Prioritization
- Tasks are automatically prioritized based on multiple factors:
  - User-assigned priority (High, Medium, Low)
  - Time until expiry (tasks closer to expiry gain higher priority)
  - Skip history (frequently skipped tasks lose priority)
- Custom algorithm calculates a priority score for each task

### Focus Mode
- Presents one task at a time to reduce overwhelm
- Locks in priority order for the duration of the session
- Allows users to complete or skip tasks with reason tracking

### Task Management
- Break down large tasks into manageable sub-tasks
- Track completion statistics
- Filter and view tasks in different ways (all tasks, by priority, by expiry date)

## 🛠️ Technology Stack

SourList is built with modern web technologies:

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library based on Radix UI
- **React Router**: For navigation and routing
- **Zustand**: State management
- **Lucide React**: Icon library
- **Recharts**: For data visualization
- **React Hook Form**: Form handling with validation

### Backend & Infrastructure
- **Supabase**: Database, authentication, and backend functionality
- **Vite**: Build tool and development server
- **Progressive Web App (PWA)**: For offline capabilities and mobile installation

## 🧩 Architecture

The application follows a component-based architecture with:
- Stores for state management
- Custom hooks for business logic
- UI components for the interface
- Supabase for backend functionality

## 🚀 Getting Started

To run the project locally:

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd sourlist

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📖 Feature Documentation

### Task Prioritization Algorithm

SourList uses a sophisticated algorithm to prioritize tasks:

1. **Base Score Assignment**:
   - High priority: 100 points
   - Medium priority: 50 points
   - Low priority: 25 points

2. **Expiry Weighting**:
   - ≤ 3 days until expiry: +50 points
   - ≤ 7 days until expiry: +30 points
   - ≤ 14 days until expiry: +15 points
   - > 14 days until expiry: +5 points

3. **Skip Penalty**:
   - Each skip reduces the task's score by 15%
   - Formula: final_score = base_score + expiry_weight - (base_score * 0.15 * skip_count)

4. **Order Determination**:
   - Tasks are presented in descending order by their final score
   - In case of tied scores, tasks closer to expiry are prioritized

### Focus Mode Details

Focus Mode helps users concentrate on one task at a time:
- Activated by clicking the "Focus" button or refreshing the page
- Locks the current priority list for the session duration
- Presents tasks one-by-one in the locked order
- Users can complete tasks or skip them with a reason that affects future priority calculations
- The presentation order remains unchanged regardless of priority score changes during the session

## 📱 Progressive Web App

SourList can be installed as a Progressive Web App on mobile devices and desktops, providing a native-like experience with offline capabilities.
