import admin from '../config/firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        req.user = await admin.auth().verifyIdToken(token);
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

export default verifyFirebaseToken;
