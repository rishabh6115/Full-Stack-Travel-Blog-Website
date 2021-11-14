const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')



module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must log in!!')
        return res.redirect('/login')
    }
    else {
        next();
    }
}

module.exports.ValidateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permissions')
        return res.redirect(`/campgrounds/${id}`)
    }
    else {
        next()
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
     if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permissions')
        return res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }

}


module.exports.ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isVerified = (req, res, next) => {
    if (req.session.hasVerified === true) {
        delete req.session.hasVerified
        next();
    } else {
        res.redirect('/forgotpassword')
    }
}