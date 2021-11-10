const express = require('express')
const router = express.Router();
const User = require('../models/user')
const CatchAsync = require('../utils/CatchAsync')
const passport = require('passport')


router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', CatchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email })
        const registerdUser = await User.register(user, password)
        req.login(registerdUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to YelpCamp, ${username}!!`)
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))
router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome Back, ${username.toUpperCase()}`)
    const url = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(url)
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged Out!!')
    res.redirect('/campgrounds')
})



module.exports = router
