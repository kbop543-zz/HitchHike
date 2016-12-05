var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hikeSchema = new Schema(
    {
        origin: {
            type: String, required: true
        },
        destination: {
            type: String, required: true    
        },
        departureDate: {
            type: String, required: true
        },
        arrivalDate: {
            type: String, required: true
        },
        capacity: {
            type: Number, required: true
        },
        driver: {
            type: String, required: true
        },
        size: {
            type: Number, default: 0
        },
        riders: {
            type: Array, default: []
        },
        price: {
            type: Number, default: 0
        }
    },
    {
        collection: 'hikes'
    }
)

mongoose.createConnection(process.env.MONGODB_URI);

module.exports = mongoose.model('Hike', hikeSchema);
