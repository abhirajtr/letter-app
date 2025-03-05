// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaGoogleDrive } from 'react-icons/fa';

function App() {
  // State for letter content and title.
  const [letter, setLetter] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  // State for displaying messages (success/error).
  const [message, setMessage] = useState('');
  // State for storing the current user object. Null means not logged in.
  const [user, setUser] = useState(null);
  // Loading states for asynchronous operations.
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || ''}/auth/current_user`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  /**
   * Load any saved draft from localStorage on component mount.
   */
  useEffect(() => {
    const savedDraft = localStorage.getItem('letterDraft');
    if (savedDraft) {
      const { letter, letterTitle } = JSON.parse(savedDraft);
      setLetter(letter);
      setLetterTitle(letterTitle);
      setMessage('Draft loaded.');
    }
  }, []);

  /**
   * handleSaveDraft: Saves the current letter content and title as a draft in localStorage.
   */
  const handleSaveDraft = () => {
    const draft = { letter, letterTitle, timestamp: Date.now() };
    localStorage.setItem('letterDraft', JSON.stringify(draft));
    setMessage('Draft saved locally.');
  };

  /**
   * handleClearDraft: Clears the saved draft from localStorage.
   */
  const handleClearDraft = () => {
    localStorage.removeItem('letterDraft');
    setMessage('Draft cleared.');
  };

  /**
   * handleSave: Sends the letter data to the backend to be saved in Google Drive.
   */
  const handleSave = async () => {
    if (!letter.trim()) {
      setMessage('Please write some content before saving.');
      return;
    }
    setLoadingSave(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/save-letter`,
        { letter, letterTitle },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      localStorage.removeItem('letterDraft');
    } catch (error) {
      console.error('Error saving letter:', error);
      setMessage('Failed to save letter');
    } finally {
      setLoadingSave(false);
    }
  };

  /**
   * handleLogout: Calls the backend to log out the user.
   */
  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await axios.get(
        `${import.meta.env.VITE_API_URL || ''}/auth/logout`,
        { withCredentials: true }
      );
      setUser(null);
      setMessage('Logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Failed to log out.');
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Letter Editor</h1>

      {/* Show a loading indicator when checking current user */}
      {loadingUser ? (
        <p className="text-center text-gray-600">Loading user...</p>
      ) : (
        <>
          {/* Authentication Section */}
          {user ? (
            <div className="mb-6 flex items-center justify-between p-4 border rounded shadow-sm">
              <div>
                <p className="text-lg font-medium">Welcome, {user.displayName}!</p>
                {user.emails && user.emails[0] && (
                  <p className="text-sm text-gray-600">{user.emails[0].value}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded hover:cursor-pointer"
                disabled={loadingLogout}
              >
                {loadingLogout ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <a
                href={`${import.meta.env.VITE_API_URL || ''}/auth/google`}
                className="flex items-center border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 px-4 py-2"
              >
                <FcGoogle className="mr-2" />
                <span className="text-gray-700 font-medium">Sign in with Google</span>
              </a>
            </div>
          )}
        </>
      )}

      {/* Input for the letter title */}
      <input
        type="text"
        className="border p-2 w-full mb-4 rounded"
        placeholder="Enter letter title"
        value={letterTitle}
        onChange={(e) => setLetterTitle(e.target.value)}
      />

      {/* Textarea for writing the letter */}
      <textarea
        className="border p-2 w-full h-64 mb-4 rounded"
        placeholder="Write your letter here..."
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
      />

      {/* Draft Controls */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleSaveDraft}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
          aria-label="Save draft"
        >
          Save Draft
        </button>
        <button
          onClick={handleClearDraft}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded"
          aria-label="Clear draft"
        >
          Clear Draft
        </button>
      </div>

      {/* Button to save the letter */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:cursor-pointer"
        disabled={loadingSave}
        aria-label="Save letter to Google Drive"
      >
        {loadingSave ? 'Saving...' : <><FaGoogleDrive /> Save to Google Drive</>}
      </button>

      {/* Display success or error messages */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default App;
