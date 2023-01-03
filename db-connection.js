const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const db = mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
});

module.exports = db;