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

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const p = Math.floor(Math.random() * 1000) + 500
        const camp = new Campground({
            author: '618bda3487c5a25fbbb64ae6',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            description: 'desLorem ipsum dolor sit, amet consectetur adipisicing elit. Quos corrupti cupiditate voluptate animi tempore libero a mollitia, atque laudantium officia? Quo itaque voluptas deserunt praesentium sed eos quae, rerum voluptatibus minima possimus non delectus doloremque voluptates quia alias amet ducimus aspernatur. Cum numquam iure mollitia amet, ut eveniet iusto unde!',
            image: 'https://source.unsplash.com/collection/483251',
            price: p
        })
        await camp.save();
    }

}
seedDB().then(() => {
    mongoose.connection.close();
})