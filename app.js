const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const CatchAsync = require('./utils/CatchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.engine('ejs', ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const ValidateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}
const ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

app.get('/campgrounds', CatchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', ValidateCampground, CatchAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.put('/campgrounds/:id', ValidateCampground, CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, (req.body.campground));
    res.redirect(`/campgrounds/${id}`)
}))
app.delete('/campgrounds/:id', CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const del = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.get('/campgrounds/:id', CatchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews')

    res.render('campgrounds/show', { campgrounds })
}))

app.get('/campgrounds/:id/edit', CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp })
}))

app.post('/campgrounds/:id/reviews', ValidateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campground/:id/reviews/:reviewId', CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})


app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.messasge) err.messasge = 'Something wenttt wrong!'
    res.status(status).render('error', { err });
})



app.listen(3000, () => {
    console.log('Listening to port 3000')
})