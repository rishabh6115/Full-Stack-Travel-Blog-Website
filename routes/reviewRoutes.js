const express = require('express')
const router = express.Router({ mergeParams: true })
const CatchAsync = require('../utils/CatchAsync')
const { isLoggedIn, ValidateReview, isReviewAuthor } = require('../middleware')
const review = require('../controllers/review')

router.post('/', isLoggedIn, ValidateReview, CatchAsync(review.createReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, CatchAsync(review.deleteReview))



module.exports = router;