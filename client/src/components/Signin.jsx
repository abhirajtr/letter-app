import { auth, provider } from '../../utils/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

function GoogleSignup() {
    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, provider);
            console.log('Google signup successful!');

            // Access user information
            const user = auth.currentUser;
            console.log('User:', user);

        } catch (error) {
            console.error('Google signup error:', error);
        }
    };

    return (
        <button onClick={handleGoogleSignup}>Signup with Google</button>
    );
}

export default GoogleSignup;