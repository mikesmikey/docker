import passport from 'passport';
import User from '../app/models/user';
import config from './auth';
import PassportJwt from 'passport-jwt';
import PassportLocal from 'passport-local';

const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;
const LocalStrategy = PassportLocal.Strategy;

const localOption = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(localOption, async function (email, password, done){
  try {
    const user = await User.findOne({email: email});

    if(!user) {
      return done(null, false, {error: 'Login failed. Please try again.'});
    }
    user.comparePassword(password, function(err, isMatch){
      if(err){
        return done(err);
      }
      if(!isMatch){
        return done(null, false, {error: 'Login failed. Please try again.'});
      }

      return done(null, user);
    });
  } catch (error) {
    return done(error);
  }
});

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOption, async (payload, done) => {
  try {
    const user = await User.findById(payload._id);
    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    return done(err, false);
  }
 
});


passport.use(jwtLogin);
passport.use(localLogin);