var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rateSchema = new Schema(
    {
        username: {
            type: String, required: true
        },
        numRates: {
            type: Number, default: 1
        },
        avgRate : {
            type: Number, default: 3
        }
    },
    {
        collection: 'ratings'
    }
);

mongoose.createConnection(process.env.MONGODB_URI);

module.exports = mongoose.model('Ratings', rateSchema);
