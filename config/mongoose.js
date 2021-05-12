const mongoose = require('mongoose');


module.exports = (config) => {
    mongoose.connect(`mongodb+srv://vikzae:${config.dbPassword}@decksaver.q8dlh.mongodb.net/DeckSaver`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('db connected');
    });
}