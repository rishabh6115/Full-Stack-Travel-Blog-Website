const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res, next) => {

    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampgroundForm = (req, res) => {

    res.render('campgrounds/new')

}

module.exports.makeNewCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(t => ({ url: t.path, filename: t.filename }))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, (req.body.campground));
    const img = req.files.map(t => ({ url: t.path, filename: t.filename }))
    camp.images.push(...img)
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated the campground!!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const del = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the campground!!')
    res.redirect('/campgrounds')
}

module.exports.showOneCampground = async (req, res, next) => {
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
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { camp })
}