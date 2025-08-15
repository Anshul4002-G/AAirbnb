const User = require('../model/user')
const bcrypt=require('bcryptjs');
const { check, validationResult } = require('express-validator');

exports.getLogin=(req,res,next)=>{
    res.render("host/login",{
        errors:[],
        oldInput:{},
        isLoggedIn:false,
    })
}

exports.postLogin=async (req,res,next)=>{
     const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).render('host/login', {
            isLoggedIn: false,
            errors: ["user does't exist"],
            oldInput: { email, password },
        })
    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
        return res.status(422).render('host/login', {
            isLoggedIn: false,
            errors: ["password is incorrect"],
            oldInput: { email, password },
            user: {}
        })
    }
    console.log(req.body);
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect("/");
}


exports.getLogout=(req,res,next)=>{
    req.session.isLoggedIn=false;
    res.redirect('/login')
}

exports.getSignup=(req,res,next)=>{
    res.render("host/signup",{
        errors:[],
        oldInput:{},
    })
}

exports.postSignup = [
    check('firstname')
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name should be atleast 2 character")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First name should only contain letters"),

    check('lastname')
        .matches(/^[A-Za-z\s]*$/)
        .withMessage("Last name should only contain letters"),

    check('email')
        .isEmail()
        .withMessage("please enter a valid email")
        .normalizeEmail(),

    check("password")
        .isLength({ min: 8 })
        .withMessage("password should be atleast 8 character")
        .matches(/[A-Z]/)
        .withMessage("password should be atleast one uppercase")
        .matches(/[a-z]/)
        .withMessage("password should be atleast one lowercase")
        .matches(/[0-9]/)
        .withMessage('password should contain atleast one number')
        .matches(/[!@#&.]/)
        .withMessage('password should contain atleast one special character'),

    check('confirmpassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password do not match');
            }
            return true;
        }),

    check('usertype')
        .notEmpty()
        .withMessage("Please select a user type")
        .isIn(['guest', 'host'])
        .withMessage('invalid user type'),

    check('terms')
        .notEmpty()
        .withMessage("Please accept the terms")
        .custom((value, { req }) => {
            if (value !== 'on') {
                throw new Error("please accept the terms first");
            }
            return true;
        }),

    (req, res, next) => {
        const { firstname, lastname, email, password, usertype } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('host/signup', {
                isLoggedIn: false,
                errors: errors.array().map(err => err.msg),
                oldInput: { firstname, lastname, email, password, usertype }
            });
        }
        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({ firstname, lastname, email, password: hashedPassword, usertype });
                return user.save()
                    .then(() => {
                        res.redirect('/login');
                    })
                    .catch(err => {
                        console.log("error in saving user ")
                        return res.status(422).render('host/signup', {
                            errors: [err.message],
                            isLoggedIn: false,
                            oldInput: { firstname, lastname, email, password, usertype },
                            user: {}
                        });
                    });
            });
    }]
