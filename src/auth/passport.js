import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/user.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  let user = await UserModel.findOne({ googleId: profile.id });
  if (!user) {
    user = await UserModel.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
      role: profile.emails[0].value === process.env.ADMIN_EMAIL ? 'admin' : 'user'
    });
  }
  done(null, user);
}));
