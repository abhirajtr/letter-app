import User from "../models/User.js";

export const googleVerify = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      console.log('User found:', user);
      return done(null, user);
    } else {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      });
      await user.save();
      console.log('New user created:', user);
      return done(null, user);
    }
  } catch (error) {
    console.error('Error in googleVerify:', error); 
    return done(error, null);
  }
};

export const googleCallback = (req, res) => {
  console.log('User after Google OAuth:', req.user); // Debugging
  console.log('Session after Google OAuth:', req.session); // Debugging
  res.redirect(process.env.CLIENT_URL || 'http://localhost:3000/dashboard');
};


export const failure = (req, res) => {
  res.status(401).json({ message: 'Authentication Failed' });
};

export const currentUser = (req, res) => {
  if (req.isAuthenticated()) {
    console.log('Authenticated user:', req.user);
    return res.status(200).json({ user: req.user });
  }
  console.log('User not authenticated');
  res.status(401).json({ user: null });
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
};

export default {
  googleCallback,
  googleVerify,
  failure,
  currentUser,
  logout,
}