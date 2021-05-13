const mongoose = require('mongoose');

const DeckShema = new mongoose.Schema({
    gameMode: {
        type: String,
    },
    deckName: {
        type: String,
    },
    deckClass: {
        type: String,
    },
    deckString: {
        type: String,
    },
    deckComments: {
        type: String,
    }
});

const deck = mongoose.model('Decks', DeckShema);

module.exports = deck;