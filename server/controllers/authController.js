import User from "../models/User.js";

export const googleVerify = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      });
      await user.save();
      return done(null, user);
    }
  } catch (error) {
    return done(error, null);
  }
};

// Callback function used after successful authentication (for redirection)
export const googleCallback = (req, res) => {
  res.redirect(process.env.CLIENT_URL || 'http://localhost:3000/dashboard');
};

export const failure = (req, res) => {
  res.status(401).json({ message: 'Authentication Failed' });
};

export const currentUser = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
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
  googleVerify,
  googleCallback,
  failure,
  currentUser,
  logout,
};
