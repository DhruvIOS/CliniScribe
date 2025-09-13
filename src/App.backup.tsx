import React, { useState } from 'react';
import { Stethoscope, Mic, FileText, MapPin, CheckSquare, Clock, User, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ConsultationView from './components/ConsultationView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'consultation' | 'history' | 'profile'>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'consultation':
        return <ConsultationView onBack={() => setCurrentView('dashboard')} />;
      case 'history':
        return <HistoryView onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <ProfileView onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Cliniscribe 2.0</h1>
              </div>
              <div className="hidden md:block ml-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('consultation')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'consultation'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    New Consultation
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'history'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('profile')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-2 px-1 ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('consultation')}
            className={`flex flex-col items-center py-2 px-1 ${
              currentView === 'consultation' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Mic className="h-5 w-5" />
            <span className="text-xs mt-1">Consult</span>
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center py-2 px-1 ${
              currentView === 'history' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center py-2 px-1 ${
              currentView === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;