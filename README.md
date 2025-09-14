# Cliniscribe - AI Healthcare Assistant

A React frontend application for AI-powered healthcare guidance and symptom analysis.

## 🚀 Features

- **Landing Page**: Clean introduction with demo access and Google authentication
- **Demo Page**: Static example showing AI analysis capabilities
- **Dashboard**: Interactive symptom input with AI-generated advice
- **History**: Review past consultations and recommendations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React (Create React App), JavaScript
- **Styling**: TailwindCSS + Material UI
- **Authentication**: Firebase Google Auth
- **Animations**: Framer Motion
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cliniscribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Google Authentication
   - Copy the configuration and create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
cliniscribe/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SymptomInput.jsx
│   │   ├── TranscriptView.jsx
│   │   ├── AdviceCard.jsx
│   │   └── VideoPlayer.jsx
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── DemoPage.jsx
│   │   ├── Dashboard.jsx
│   │   └── HistoryPage.jsx
│   ├── utils/
│   │   └── firebase.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation with dark mode toggle and auth state
- **SymptomInput**: Text input with microphone button (future feature)
- **TranscriptView**: Display user input symptoms
- **AdviceCard**: Reusable card for different advice types
- **VideoPlayer**: Placeholder for AI-generated videos

### Pages
- **Landing**: Hero section with feature highlights
- **Demo**: Static example of AI analysis
- **Dashboard**: Main application interface
- **History**: Past consultation review

## 🔧 Configuration

### TailwindCSS
Custom color palette for healthcare theme:
- Primary blues: `primary-50` to `primary-900`
- Healthcare colors: `healthcare-green`, `healthcare-blue`, `healthcare-teal`

### Material UI
Integrated with Tailwind for consistent theming and dark mode support.

## 🚦 Current Status

✅ **Completed Features:**
- React app setup with routing
- Firebase authentication integration
- All core components built
- Landing, Demo, Dashboard, and History pages
- Dark mode functionality
- Responsive design
- Mock AI responses for demo

🔄 **Future Enhancements:**
- Real AI integration for symptom analysis
- Voice input recording
- Google Maps integration for healthcare providers
- Video generation with Gemini Veo 3
- Backend API integration
- User profile management

## 🔐 Environment Variables

Required environment variables for Firebase:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized typography scaling

## 🎯 Next Steps

1. Set up Firebase project and authentication
2. Integrate real AI API for symptom analysis
3. Add Google Maps for healthcare provider locations
4. Implement video generation capabilities
5. Add user profile and preferences
6. Deploy to production

## 📄 License

This project is for demonstration purposes.