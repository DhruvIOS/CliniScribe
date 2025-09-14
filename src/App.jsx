import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import NewDashboard from './components/NewDashboard';
import ConsultationResults from './components/ConsultationResults';
import { AnimatePresence, motion } from 'framer-motion';
import { pageFade } from './animations';
import PageLoader from './components/PageLoader';
import { RouteLoaderProvider, useRouteLoader } from './loaderContext';

// Protected Route component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('userName');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Page({ children }) {
  return (
    <motion.div
      variants={pageFade}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const { showGlobalLoader, setShowGlobalLoader } = useRouteLoader();

  // Control full-screen loader via context flag
  useEffect(() => {
    let timer;
    if (showGlobalLoader) {
      setRouteLoading(true);
      timer = window.setTimeout(() => {
        setRouteLoading(false);
        setShowGlobalLoader(false);
      }, 600);
    } else {
      setRouteLoading(false);
    }
    return () => { if (timer) window.clearTimeout(timer); };
  }, [showGlobalLoader, setShowGlobalLoader]);
  return (
    <>
      {routeLoading && <PageLoader />}
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Page><LandingPage /></Page>} />
        <Route path="/login" element={<Page><LoginPage /></Page>} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Page><NewDashboard /></Page>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultation-results"
          element={
            <ProtectedRoute>
              <Page><ConsultationResults /></Page>
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <RouteLoaderProvider>
        <AnimatedRoutes />
      </RouteLoaderProvider>
    </Router>
  );
}

export default App;
