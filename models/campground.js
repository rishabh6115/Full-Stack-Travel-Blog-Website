const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review')
const { cloudinary } = require('../cloudinary/index')
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({

  url: String,
  filename: String

})

imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200')
})

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }

  },
  images: [imageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

campgroundSchema.virtual('properties.popUp').get(function () {
  return `
  <b><a href="/campgrounds/${this._id}">${this.title}</a></b> `
});



campgroundSchema.post('findOneAndDelete', async function (doc) {
  const delImages = doc.images.map(t => t.filename)
  for (let d of delImages) {
    cloudinary.uploader.destroy(d)
  }
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model("Campground", campgroundSchema);
