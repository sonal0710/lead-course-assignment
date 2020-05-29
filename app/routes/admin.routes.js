const jwt = require('jsonwebtoken');
const passport = require("passport");

module.exports = app => {

  // Create a new Admin
  app.post('/signup', passport.authenticate('local-signup', { session : false }) , async (req, res, next) => {
    res.json({
      message : 'Signup successful',
      user : req.user
    });
  });

  // Admin Login
  app.post('/login', async (req, res, next) => {
    passport.authenticate('local-login', async (err, user, info) => {     
      try {
        if(err || !user){
          const error = new Error('An Error occurred')
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)

          const body = { _id : user._id, email : user.email };

          const token = jwt.sign({ user : body },'top_secret');
          
          return res.json({ token });
        });     
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

};
