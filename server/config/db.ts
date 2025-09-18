// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'; // Replace with your actual connection string
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

module.exports = uri;