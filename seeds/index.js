const mongoose = require('mongoose')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')
const cities = require('./citites')


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({})

    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const p = Math.floor(Math.random() * 1000) + 500
        const camp = new Campground({
            author: '618bda3487c5a25fbbb64ae6',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            description: 'desLorem ipsum dolor sit, amet consectetur adipisicing elit. Quos corrupti cupiditate voluptate animi tempore libero a mollitia, atque laudantium officia? Quo itaque voluptas deserunt praesentium sed eos quae, rerum voluptatibus minima possimus non delectus doloremque voluptates quia alias amet ducimus aspernatur. Cum numquam iure mollitia amet, ut eveniet iusto unde!',
            price: p,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ddfcndmo7/image/upload/v1636630460/YelpCamp/sclzylixlijzhzvxpvki.jpg',
                    filename: 'YelpCamp/sclzylixlijzhzvxpvki',

                },
                {
                    url: 'https://res.cloudinary.com/ddfcndmo7/image/upload/v1636630460/YelpCamp/l0zw8h3mlpuf0z9rwhmp.jpg',
                    filename: 'YelpCamp/l0zw8h3mlpuf0z9rwhmp',

                }

            ]
        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close();
})