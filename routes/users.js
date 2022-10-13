var express = require('express');
var router = express.Router();
var db = require('../config/database.js');
const UserModel = require('../models/Users');
const UserError = require("../helpers/error/UserError");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var bcrypt = require('bcrypt');
const { registerValidator } = require("../middleware/validation");

router.post('/register', registerValidator,(req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;


  UserModel.usernameExists(username)
    .then((userDoesNameExist) => {
      if (userDoesNameExist) {
        throw new UserError(
          "Registration Faild: Username already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.emailExists(email);
      }

    })
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Registration Faild: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserID) => {
      if (createdUserID < 0) {
        throw new UserError(
          "Server Error, user could not be created",
          "/resgistration",
          500
        );
      } else {
        req.flash('success', 'User account has been made!');
        res.redirect('/login');
      }
    }).catch((error) => {
      errorPrint("user could not be made", error);
      if (error instanceof UserError) {
        errorPrint(error.getMessage());
        req.flash('error', error.getMessage());
        res.status(error.getStatus());
        res.redirect(error.getRedirectURL());

      } else {
        next(err);
      }
    });

  /*
   db.execute("SELECT * FROM users WHERE username=?", [username])
   .then(([results, fields]) => {
     if(results && results.length == 0){
      return db.execute("SELECT * FROM users WHERE email=?", [email]);
     }else{
       throw new UserError(
        "Registration Faild: Username already exists", 
        "/registration",
        200
       );
     }
    })
    .then(([results, fields]) => {
      if(results && results.length == 0){
        return bcrypt.hash(password,15);
       }else{
         throw new UserError(
          "Registration Faild: Email already exists", 
          "/registration",
          200
         );
    }
    })
    .then((hashedPassword) => {
  
        let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?,now());"
        return db.execute(baseSQL,[username, email, hashedPassword]);
  
  })
  .then(([results, fields]) => {
    if (results && results.affectedRows){
      successPrint("User.js --> User was created!");
      req.flash('success', 'User account has been made!');
      res.redirect('/login');
    }else{
      throw new userError(
        "Server Error, user could not be created",
        "/resgistration",
        500
      );
    }
  })
  .catch((error) => {
    errorPrint("user could not be made", error);
    if(error instanceof UserError){
      errorPrint(error.getMessage());
      req.flash('error', error.getMessage());
      res.status(error.getStatus());
      res.redirect(error.getRedirectURL());
  
    }else{
      next(error);
    }
  });*/

});


router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;



  UserModel.authenticate(username, password)
    .then((loggedUserID) => {
      if (loggedUserID > 0) {
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserID;
        res.locals.logged = true;
        req.flash('success', 'You have been successfully logged in!');
        res.redirect("/");
      } else {
        //throw new UserError("Invalid username and/or password!", "/login", 200);
        res.locals.logged = false;
        req.flash('error','Invalid username and/or password!');
        res.redirect('/login');
      }
    })
    .catch((err) => {
      errorPrint("user login faild!");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', 'user login faild');
        res.status(err.getStatus());
        res.redirect('/login');
      } else {
        next(err);
      }
    });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('Session could no be destroyed.');
      next(err);
    } else {
      successPrint('Session was destroyed successfully!');
      res.clearCookie('csid');
      res.json({ status: "OK", message: "user is logged out" });
    }
  })
});

module.exports = router;


