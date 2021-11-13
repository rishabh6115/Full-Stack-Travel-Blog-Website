const express = require('express')
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const user = require('../controllers/user')
const { isLoggedIn, isVerified } = require('../middleware')
const User = require('../models/user')
router.route('/register')
    .get(user.renderRegister)
    .post(CatchAsync(user.registerUser))


router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)

router.get('/forgotpassword', isLoggedIn, user.forgotPassword)

router.post('/validatepassword', isLoggedIn, passport.authenticate('local', {
    successFlash: 'Approved, Change the password',
    failureFlash: true,
    failureRedirect: '/forgotpassword'
}), user.validatePassword)


router.route('/changepassword')
    .get(isVerified, user.changePasswordRender)
    .post(user.changePassword)


module.exports = router
