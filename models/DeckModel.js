const mongoose = require('mongoose');

const DeckShema = new mongoose.Schema({
    name: {
        type: String,
    },
    class: {
        type: String,
    },
    gameMode: {
        type: String,
    },
    deckString: {
        type: String,
    },
    comments: {
        type: String,
    }
});

const deck = mongoose.model('Decks', DeckShema)

module.exports = deck;