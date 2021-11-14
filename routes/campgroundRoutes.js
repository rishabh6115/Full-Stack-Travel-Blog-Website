const express = require('express')
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const { isLoggedIn, ValidateCampground, isAuthor } = require('../middleware')
const campground = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    .get(CatchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), ValidateCampground, CatchAsync(campground.makeNewCampground))


router.get('/new', isLoggedIn, campground.newCampgroundForm)

router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), ValidateCampground, CatchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, CatchAsync(campground.deleteCampground))
    .get(CatchAsync(campground.showOneCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campground.editCampground))

module.exports = router;