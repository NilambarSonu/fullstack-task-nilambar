// backend/config/passport.js
const passport = require("passport");
const User = require("../models/User");

// Wrap strategy requires in try/catch so missing packages don't crash import
try {
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.BACKEND_URL) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            googleId: profile.id
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));
  } else {
    console.warn("GoogleStrategy skipped - missing GOOGLE_CLIENT_ID/SECRET or BACKEND_URL");
  }
} catch (err) {
  console.warn("passport-google-oauth20 not available or failed to load:", err.message);
}

try {
  const GitHubStrategy = require("passport-github2").Strategy;
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.BACKEND_URL) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            username: profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            githubId: profile.id
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));
  } else {
    console.warn("GitHubStrategy skipped - missing GITHUB_CLIENT_ID/SECRET or BACKEND_URL");
  }
} catch (err) {
  console.warn("passport-github2 not available or failed to load:", err.message);
}

// Fallback serialization (works even if passport strategies are skipped)
passport.serializeUser((user, done) => done(null, user && user.id ? user.id : user));
passport.deserializeUser((id, done) => {
  if (!id) return done(null, null);
  User.findById(id).then(user => done(null, user)).catch(err => done(err));
});

module.exports = passport;
