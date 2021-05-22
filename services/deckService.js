let deckModel;

const save = (gameMode, deckClass, deckName, deckString, deckComments, guildId) => {
    deckModel = require('../models/deckModel')(guildId);
    let deck = new deckModel({
        gameMode: gameMode.toLowerCase(),
        deckName: deckName,
        deckClass: deckClass.toLowerCase(),
        deckString: deckString,
        deckComments: deckComments,
    });
    return deck.save();
};

const get = (gameMode, deckName, guildId) => {
    deckModel = require('../models/deckModel')(guildId);
    return deckModel.findOne({gameMode: gameMode.toLowerCase(), deckName: deckName}); 
};

const all = async (gameMode, guildId) => {
    deckModel = require('../models/deckModel')(guildId);
    let decks = await deckModel.find({gameMode: gameMode.toLowerCase()});
    if(decks.length == 0) throw 'Wrong class or there are no decks in this class!';
    return decks;
};

const allFromClass = async (deckClass, gameMode, guildId) => {
    deckModel = require('../models/deckModel')(guildId);
    if(gameMode) {
        let decks = await deckModel.find({deckClass: deckClass.toLowerCase(), gameMode: gameMode.toLowerCase()});
        if(decks.length == 0) throw 'Wrong class or there are no decks in this GameMode!';
        return decks;
    } else {
        let decks = await deckModel.find({deckClass: deckClass.toLowerCase()});
        if(decks.length == 0) throw 'Wrong class or there are no decks in this class!';
        return decks;
    }
};

const deleteDeck = async (gameMode, deckClass, deckName, guildId) => {
    deckModel = require('../models/deckModel')(guildId);
    let deck = await deckModel.findOneAndRemove({gameMode: gameMode.toLowerCase(), deckClass: deckClass.toLowerCase(),deckName: deckName});
    if(deck == null) throw 'Deck Not Found';
    return deck;
}

module.exports = {
    save: save,
    get: get,
    all: all,
    allFromClass: allFromClass,
    deleteDeck: deleteDeck,
};