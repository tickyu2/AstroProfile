# Firebase Project Setup Guide

Follow these steps to create your Firebase development project and configure AstroProfile.

---

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click **"Add project"** or **"Create a project"**
   - Project name: `astroprofile-dev`
   - Click **Continue**

3. **Google Analytics** (Optional)
   - Toggle **OFF** for now (you can enable later)
   - Click **Create project**
   - Wait 30-60 seconds for project creation
   - Click **Continue** when ready

---

## Step 2: Add Web App to Firebase Project

1. **Add Web App**
   - In Firebase Console, click the **web icon** (`</>`) to add a web app
   - It's in the center of the page or under **Project Overview → Add app**

2. **Register App**
   - App nickname: `AstroProfile Web App`
   - **DO NOT** check "Also set up Firebase Hosting" (we'll do this later)
   - Click **Register app**

3. **Copy Firebase Configuration**
   - You'll see a code snippet with your `firebaseConfig` object
   - It looks like this:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "astroprofile-dev.firebaseapp.com",
     projectId: "astroprofile-dev",
     storageBucket: "astroprofile-dev.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
     measurementId: "G-ABC123XYZ"
   };
   ```

   **📋 COPY THESE VALUES** - You'll need them for Step 4

4. **Complete Setup**
   - Click **Continue to console**

---

## Step 3: Enable Authentication

1. **Navigate to Authentication**
   - In Firebase Console left sidebar, click **Build → Authentication**
   - Click **Get started**

2. **Enable Email/Password**
   - Click **Sign-in method** tab
   - Click **Email/Password** (first option)
   - Toggle **Enable** switch to ON
   - Leave "Email link (passwordless sign-in)" OFF for now
   - Click **Save**

3. **Verify Setup**
   - You should see "Email/Password" with status **Enabled**

---

## Step 4: Set Up Firestore Database

1. **Navigate to Firestore**
   - In left sidebar, click **Build → Firestore Database**
   - Click **Create database**

2. **Choose Location**
   - **Production mode** (we'll add security rules later)
   - Click **Next**

3. **Select Region**
   - Choose a region close to your users:
     - `us-central1` (Iowa) - Good for US/Americas
     - `europe-west1` (Belgium) - Good for Europe
     - `asia-northeast1` (Tokyo) - Good for Asia
   - **IMPORTANT:** You cannot change this later!
   - Click **Enable**
   - Wait 1-2 minutes for Firestore to provision

4. **Verify Setup**
   - You should see an empty Firestore database interface

---

## Step 5: Create .env.local File

1. **Open Your Code Editor**
   - Navigate to project root: `C:\astroprofile`

2. **Create .env.local File**
   - Copy `.env.example` to `.env.local`
   - Or create new file named `.env.local`

3. **Fill in Firebase Config Values**
   - Use the values from Step 2
   - Replace the placeholder values with your actual Firebase config:

   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyC...                    # Your actual API key
   VITE_FIREBASE_AUTH_DOMAIN=astroprofile-dev.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=astroprofile-dev
   VITE_FIREBASE_STORAGE_BUCKET=astroprofile-dev.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789         # Your actual sender ID
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123        # Your actual app ID
   VITE_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ           # Your actual measurement ID

   # App Configuration
   VITE_APP_ENV=development

   # Firebase Emulators (keep false for now)
   VITE_USE_EMULATORS=false
   ```

4. **Save the File**
   - Make sure it's saved as `.env.local` (not `.env.local.txt`)
   - Verify it's in the project root directory

---

## Step 6: Test Firebase Connection

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Check Console Output**
   - You should see Vite starting
   - Open browser to `http://localhost:5173`
   - Open browser DevTools (F12)
   - Check Console tab

3. **Expected Output**
   - No Firebase errors
   - If you see "Missing required environment variable" - check your .env.local file
   - If you see CORS errors - this is normal, we haven't set up Auth UI yet

---

## Step 7: Install Firebase CLI (Optional - for later)

This is needed for deploying security rules and hosting, but we'll do this in Phase 2.

1. **Install Firebase Tools Globally**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```
   - This will open a browser for authentication
   - Sign in with your Google account
   - Grant Firebase CLI permissions

3. **Verify Login**
   ```bash
   firebase projects:list
   ```
   - You should see `astroprofile-dev` in the list

---

## ✅ Verification Checklist

Before continuing, verify:

- [ ] Firebase project `astroprofile-dev` created
- [ ] Web app registered in Firebase project
- [ ] Email/Password authentication enabled
- [ ] Firestore database created in a region
- [ ] `.env.local` file created with real Firebase config values
- [ ] No syntax errors in `.env.local` (no quotes around values)
- [ ] Dev server starts without Firebase errors

---

## 🎯 What You Should Have Now

1. **Firebase Console**
   - Project: `astroprofile-dev`
   - Authentication: Email/Password enabled
   - Firestore: Empty database ready

2. **Local Project**
   - `.env.local` file with Firebase credentials
   - `src/config/firebase.js` configured
   - Dependencies installed (firebase, react-router-dom)

---

## 🚀 Next Steps (After You Complete This)

Once you've completed this setup, let Claude Code know and we'll continue with:

1. **Create Auth Context** - Login/signup functionality
2. **Build Auth UI Components** - Login, Register, Password Reset forms
3. **Set up Protected Routes** - Dashboard, Profile pages
4. **Create Profile Context** - CRUD operations for profiles
5. **Deploy Security Rules** - Protect your Firestore data

---

## ⚠️ Troubleshooting

### "Missing required environment variable"
- Check `.env.local` exists in project root
- Verify all VITE_ variables are present
- Restart dev server (`npm run dev`)

### "Firebase: Error (auth/invalid-api-key)"
- Your API key is incorrect
- Go back to Firebase Console → Project Settings → General
- Copy the correct API key from SDK setup

### "Firestore: Missing or insufficient permissions"
- This is expected - we haven't set up security rules yet
- We'll add rules in the next phase

### Can't find .env.local file
- Make sure you're in the project root directory
- Enable "Show hidden files" in your file explorer
- Use command line: `ls -la` (Mac/Linux) or `dir /a` (Windows)

---

## 📝 Notes

- **API Key Security:** Firebase API keys are safe to commit (they're restricted by Firebase security rules)
- **Project ID:** Must match exactly in all configs
- **Region:** Cannot be changed after creation - choose carefully!
- **Free Tier:** Firestore free tier is generous (50K reads/day, 20K writes/day)

---

## 🔗 Helpful Links

- Firebase Console: https://console.firebase.google.com/
- Firebase Documentation: https://firebase.google.com/docs
- Firestore Pricing: https://firebase.google.com/pricing
- Firebase Status: https://status.firebase.google.com/

---

**Once you've completed this setup, copy your Firebase config values and let me know - we'll continue building the authentication system!**
