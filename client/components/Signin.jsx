// GoogleSignup.js
import React from 'react';
import { auth, provider } from '../utils/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
console.log("api");

function GoogleSignup() {
    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, provider);
            // User signed up/in successfully
            console.log('Google signup successful!');

            // Access user information
            const user = auth.currentUser;
            console.log('User:', user);
            // You can redirect the user or update the UI here.

        } catch (error) {
            console.error('Google signup error:', error);
            // Handle errors (e.g., display an error message)
        }
    };

    return (
        <button onClick={handleGoogleSignup}>Signup with Google</button>
    );
}

export default GoogleSignup;