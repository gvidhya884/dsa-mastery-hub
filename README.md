# DSA MASTERY HUB 🚀

An interactive web application for mastering Data Structures and Algorithms with personalized learning features, quizzes, and progress tracking.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Environment Setup](#environment-setup)
- [Building for Production](#building-for-production)
- [Mobile App (Capacitor)](#mobile-app-capacitor)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 📚 **Comprehensive DSA Concepts** - Covers all major data structures and algorithms
- 🎯 **Interactive Quizzes** - Test your knowledge with categorized questions
- 📝 **Personal Notes** - Save and manage your learning notes
- 🔖 **Bookmarks** - Bookmark important concepts for quick access
- 📊 **Progress Tracking** - Monitor your learning journey
- 🎨 **Custom Concepts** - Add your own DSA concepts
- 🔍 **Smart Search** - Auto-suggest and search functionality
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Code Blocks** - Syntax-highlighted code examples
- 📈 **Complexity Analysis** - Time and space complexity badges

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React, React Icons
- **Mobile**: Capacitor JS
- **Language**: JavaScript (ES6+)
- **State Management**: React Hooks (Context API)
- **Data Storage**: LocalStorage + JSON files

## 📁 Project Structure
DSA-MASTERY-HUB/
├── public/ # Static assets
├── src/
│ ├── components/ # React components
│ │ ├── Bookmarks/ # Bookmark functionality
│ │ ├── Concept/ # Concept display components
│ │ ├── CustomConcept/ # User-added concepts
│ │ ├── Layout/ # Layout components
│ │ ├── Library/ #Total algorithms
│ │ ├── Notes/ # Notes management
│ │ ├── Profile/ # User profile
│ │ ├── Progress/ # Progress tracking
│ │ ├── Quiz/ # Quiz components
│ │ └── Search/ # Search functionality
│ ├── data/ # JSON data files
│ │ ├── dsa_dataset.json
│ │ └── quiz_questions.json
│ ├── styles/ # CSS files
│ ├── utils/ # Utility functions
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point
├── .gitignore
├── capacitor.config.json # Capacitor config for mobile
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/DSA-MASTERY-HUB.git
cd DSA-MASTERY-HUB

# Install dependencies
npm install

# Or if using yarn
yarn install

# Start development server
npm run dev

# The app will be available at:
# http://localhost:5173
This is a test change
