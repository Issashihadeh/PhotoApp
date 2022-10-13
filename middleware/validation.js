const checkUsername = (username) => {

let usernameChecker = /^\D\w{2,}$/;
return usernameChecker.test(username);
}

const checkPassword = (password) => {
    let passwordChecker = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordChecker.test(password);
}

const checkEmail = (email) => {
    let emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailChecker.test(email);
}


const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    if(!checkUsername(username)){
        req.flash('error',"invalid username!!!");
        req.session.save(err => {
            res.redirect("/registration");
    });
    }else if(!checkEmail(email)){
        req.flash('error',"invalid Email!!!");
        req.session.save(err => {
            res.redirect("/registration");
    });
        
    }else if(!checkPassword(password)){
        req.flash('error', "Password must be at least8 characters long, contains Upper and lower case characters, and a special character");
        req.session.save(err => {
            res.redirect("/registration");
        })

    }else if (password != cpassword){
        req.flash('error', "password did not match");
        req.session.save(err => {
            res.redirect("/registration");
    });
    }else{
        next();
    }
}

const loginValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    
    
}

module.exports = {registerValidator, loginValidator}