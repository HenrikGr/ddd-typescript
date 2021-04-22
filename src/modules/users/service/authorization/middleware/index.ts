import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { userDao } from '../../../infra/database'

// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(
  new LocalStrategy(function (username, password, cb) {
    userDao
      .getUserByUserName(username)
      .then((user) => {
        // TODO: Password validation
        return cb(null, user)
      })
      .catch((err) => {
        return cb(err)
      })

    /*
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });

     */
  })
)

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user: any, cb) {
  cb(null, user._id)
})

passport.deserializeUser(function (id: string, cb) {
  userDao
    .getUserByUserId(id)
    .then((user) => {
      cb(null, user)
    })
    .catch((err) => {
      if (err) {
        return cb(err)
      }
    })
})

export const authenticate = passport.authenticate('local', { failureRedirect: '/login' })
