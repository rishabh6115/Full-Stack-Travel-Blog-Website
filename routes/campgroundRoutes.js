const express = require('express')
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, ValidateCampground, isAuthor } = require('../middleware')

router.get('/', CatchAsync(async (req, res, next) => {

    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')

})

router.post('/', isLoggedIn, ValidateCampground, CatchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', isLoggedIn, isAuthor, ValidateCampground, CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, (req.body.campground));
    req.flash('success', 'Successfully updated the campground!!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res, next) => {
    const { id } = req.params;

    const del = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the campground!!')
    res.redirect('/campgrounds')
}))

router.get('/:id', CatchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!campgrounds) {
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { camp })
}))

module.exports = router;