const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({
            min: 4
        }),
], authController.postLogin);
router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            //check if email already exists! 
            return User.findOne({
                email: value
            }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists!');
                }
            })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({
            min: 4
        }),
    body('name')
        .trim()
]
    , authController.postSignup);

router.get('/users', isAuth, authController.getUsers);

router.get('/users/:id', isAuth, authController.getUser);

router.delete('/users/:id', isAuth, authController.deleteUser);

router.put('/users/:id', [body('email')
    .isEmail()
    .withMessage('Please enter a valid email!')
    .custom((value, { req }) => {
        //check if email already exists! 
        return User.findOne({
            email: value
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email address already exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password')
        .trim()
        .isLength({
            min: 4
        }),
    body('name')
        .trim()], isAuth, authController.updateUser);



module.exports = router;