import { Request, Response } from 'express';
import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { app_ } from '../index';

interface GoogleUser {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}

// 🔹 Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? '',
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const user: GoogleUser = { accessToken, refreshToken, profile };
      return done(null, user);
    }
  )
);

// 🔹 Initialize Passport
app_.use(passport.initialize());

// 🔹 Start Google consent
app_.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.readonly'],
    accessType: 'offline',
    prompt: 'consent',
    session: false,
  })
);

// 🔹 Callback after consent
app_.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false,
  }),
  (req: Request, res: Response) => {
    const user = req.user as GoogleUser;
    res.json({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      profile: user.profile,
    });
  }
);

// 🔹 Failure route
app_.get('/auth/failure', (_req: Request, res: Response) => {
  res.status(401).send('Consent failed');
});
