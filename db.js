const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://FredBail:S3xBLma5CV3nHSd@cluster0.cbidg.mongodb.net/Cluster0?retryWrites=true&w=majority";

const connectDB = () => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.log(err));
};

module.exports = connectDB;