import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Settings, Bell } from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'preferences'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  const personalInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: '123 Main Street, San Francisco, CA 94102',
    emergencyContact: 'John Johnson - +1 (555) 987-6543'
  };

  const medicalInfo = {
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Vitamin D 1000IU daily', 'Multivitamin'],
    conditions: ['Seasonal Allergies'],
    bloodType: 'O+',
    insurance: 'Blue Cross Blue Shield - Policy #12345'
  };

  const preferences = {
    notifications: {
      email: true,
      sms: false,
      reminders: true,
      followUp: true
    },
    privacy: {
      shareData: false,
      anonymousResearch: true
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-2"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            <p className="text-gray-600">Manage your personal and medical information</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{personalInfo.name}</h3>
            <p className="text-gray-600">{personalInfo.email}</p>
            <div className="flex items-center mt-2">
              <Shield className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'personal'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'medical'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Medical Info
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'preferences'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Preferences
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={personalInfo.name}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Address
              </label>
              <input
                type="text"
                value={personalInfo.address}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Emergency Contact
              </label>
              <input
                type="text"
                value={personalInfo.emergencyContact}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <input
                  type="text"
                  value={medicalInfo.bloodType}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                <input
                  type="text"
                  value={medicalInfo.insurance}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {medicalInfo.allergies.map((allergy, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {allergy}
                    {isEditing && (
                      <button className="ml-2 text-red-600 hover:text-red-800">×</button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Add new allergy..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
              <div className="space-y-2 mb-2">
                {medicalInfo.medications.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-900">{medication}</span>
                    {isEditing && (
                      <button className="text-red-600 hover:text-red-800">Remove</button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Add new medication..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {medicalInfo.conditions.map((condition, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {condition}
                    {isEditing && (
                      <button className="ml-2 text-yellow-600 hover:text-yellow-800">×</button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Add medical condition..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">SMS notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.reminders}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Medication reminders</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.followUp}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Follow-up reminders</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.privacy.shareData}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Share data with healthcare providers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.privacy.anonymousResearch}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Contribute to anonymous medical research</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Delete Account
              </button>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;