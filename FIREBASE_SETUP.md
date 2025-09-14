# Firebase Setup Guide for Cliniscribe

This guide will help you connect your Cliniscribe application to Firebase for authentication, database, and other services.

## Prerequisites

1. A Google account
2. Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "cliniscribe-app")
4. Enable Google Analytics (recommended)
5. Choose or create a Google Analytics account
6. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Enable **Google** as a sign-in provider:
   - Click on Google in the list
   - Toggle the **Enable** switch
   - Enter your project's support email
   - Click **Save**

## Step 3: Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (you can change this later)
4. Select a location for your database (choose one closest to your users)
5. Click **Done**

## Step 4: Get Firebase Configuration

1. In the Firebase Console, click on the gear icon (⚙️) next to "Project Overview"
2. Select **Project settings**
3. Scroll down to the "Your apps" section
4. Click the web icon `</>` to add a web app
5. Give your app a nickname (e.g., "Cliniscribe Web")
6. **Optional:** Enable Firebase Hosting
7. Click **Register app**
8. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. In your Cliniscribe project, open the `.env` file
2. Replace the Firebase environment variables with your actual values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

### Example Firebase Config Object:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Copy this to VITE_FIREBASE_API_KEY
  authDomain: "cliniscribe-app.firebaseapp.com", // Copy to VITE_FIREBASE_AUTH_DOMAIN
  projectId: "cliniscribe-app", // Copy to VITE_FIREBASE_PROJECT_ID
  storageBucket: "cliniscribe-app.appspot.com", // Copy to VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // Copy to VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123def456", // Copy to VITE_FIREBASE_APP_ID
  measurementId: "G-ABCDEF1234" // Copy to VITE_FIREBASE_MEASUREMENT_ID
};
```

## Step 6: Configure Firestore Security Rules (Optional but Recommended)

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with more secure ones:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own consultations
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Users can read/write their own health profiles
    match /healthProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 7: Test the Connection

1. Restart your development servers:
   ```bash
   # Stop current servers (Ctrl+C)

   # Restart frontend
   npm run dev

   # Restart backend (in another terminal)
   node backend/server.js
   ```

2. Navigate to `http://localhost:5173`
3. Try signing in with Google
4. Check the Firebase Console → Authentication to see if the user was created

## Features Enabled

Once Firebase is connected, your Cliniscribe app will have:

✅ **Google Authentication**: Real Google OAuth sign-in
✅ **User Management**: Automatic user profile creation in Firestore
✅ **Data Persistence**: Consultations saved to Firestore database
✅ **Real-time Sync**: Data synced across devices
✅ **Secure Access**: User-specific data access rules
✅ **Health Profiles**: Store user health information securely

## Troubleshooting

### Common Issues:

1. **"Firebase configuration not found"**
   - Make sure all VITE_FIREBASE_* variables are set in your `.env` file
   - Restart your development server after changing environment variables

2. **"Auth domain not authorized"**
   - Go to Firebase Console → Authentication → Settings
   - Add your local development URL (`http://localhost:5173`) to authorized domains

3. **"Permission denied" when writing to Firestore**
   - Check your Firestore security rules
   - Make sure the user is authenticated before trying to write data

4. **Google sign-in popup blocked**
   - Check your browser's popup blocker settings
   - Try using a different browser or incognito mode

## Next Steps

After Firebase is connected, you can:
- View user data in Firebase Console → Authentication
- Check consultation data in Firebase Console → Firestore Database
- Monitor app usage with Firebase Analytics
- Set up additional Firebase services like Storage or Cloud Functions

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration in the Firebase Console
3. Ensure all environment variables are correctly set
4. Test with a fresh browser session (incognito mode)