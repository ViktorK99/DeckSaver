module.exports = (app) => {
    const Strategy = require('passport-discord');
    const passport = require('passport');
    
    let scopes = ['identify', 'guilds'];
    let prompt = 'consent';
    
    passport.use(new Strategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/discord/callback',
        scope: scopes,
        prompt: prompt
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}