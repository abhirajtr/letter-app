import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FcGoogle } from 'react-icons/fc';
import { FaGoogleDrive } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

function App() {
  const [letter, setLetter] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setMessage('Successfully signed in.');
        const storedToken = localStorage.getItem('googleAccessToken');
        if (storedToken) setGoogleAccessToken(storedToken);
      } else {
        setUser(null);
        localStorage.removeItem('googleAccessToken');
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedDraft = localStorage.getItem('letterDraft');
    if (savedDraft) {
      const { letter, letterTitle } = JSON.parse(savedDraft);
      setLetter(letter);
      setLetterTitle(letterTitle);
      setMessage('Draft loaded.');
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      localStorage.setItem('googleAccessToken', accessToken);
      setGoogleAccessToken(accessToken);
      setMessage('Successfully signed in.');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setMessage('Failed to sign in with Google.');
    }
  };

  const handleSaveDraft = () => {
    const draft = { letter, letterTitle, timestamp: Date.now() };
    localStorage.setItem('letterDraft', JSON.stringify(draft));
    setMessage('Draft saved locally.');
  };

  const handleClearDraft = () => {
    localStorage.removeItem('letterDraft');
    setMessage('Draft cleared.');
  };

  const handleSave = async () => {
    if (!letter.trim()) {
      setMessage('Please write some content before saving.');
      return;
    }
    if (!googleAccessToken) {
      setMessage('Missing Google access. Please sign in again.');
      return;
    }

    setLoadingSave(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/save-letter`,
        { letter, letterTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Google-Access-Token': googleAccessToken
          }
        }
      );
      setMessage(response.data.message);
      localStorage.removeItem('letterDraft');
    } catch (error) {
      console.error('Save Error:', error);
      setMessage(error.response?.data?.message || 'Failed to save letter');
      if (error.response?.status === 401) {
        localStorage.removeItem('googleAccessToken');
        setGoogleAccessToken('');
      }
    } finally {
      setLoadingSave(false);
    }
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('googleAccessToken');
      setMessage('Logged out successfully.');
    } catch (error) {
      console.error('Logout Error:', error);
      setMessage('Failed to log out.');
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Letter Editor</h1>

      {loadingUser ? (
        <p className="text-center text-gray-600">Loading user...</p>
      ) : user ? (
        <div className="mb-6 flex items-center justify-between p-4 border rounded shadow-sm">
          <div>
            <p className="text-lg font-medium">
              Welcome, {user.displayName || 'User'}!
            </p>
            {user.email && (
              <p className="text-sm text-gray-600">{user.email}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
            disabled={loadingLogout}
          >
            {loadingLogout ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 px-4 py-2"
          >
            <FcGoogle className="mr-2" />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      )}

      <input
        type="text"
        className="border p-2 w-full mb-4 rounded"
        placeholder="Enter letter title"
        value={letterTitle}
        onChange={(e) => setLetterTitle(e.target.value)}
      />

      {/* React Quill Editor */}
      <ReactQuill
        value={letter}
        onChange={setLetter}
        placeholder="Write your letter here..."
        className="mb-15 h-50"
        style={{ }}
      />

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleSaveDraft}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
        >
          Save Draft
        </button>
        <button
          onClick={handleClearDraft}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
        >
          Clear Draft
        </button>
      </div>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        disabled={loadingSave || !user}
      >
        {loadingSave ? 'Saving...' : <><FaGoogleDrive /> Save to Google Drive</>}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default App;
