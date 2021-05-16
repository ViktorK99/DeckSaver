const deckModel = require('../models/deckModel');

const save = (gameMode, deckClass, deckName, deckString, deckComments) => {
    let deck = new deckModel({
        gameMode: gameMode.toLowerCase(),
        deckName: deckName,
        deckClass: deckClass.toLowerCase(),
        deckString: deckString,
        deckComments: deckComments,
    });
    return deck.save();
};

const get = (gameMode, deckName) => {
    return deckModel.findOne({gameMode: gameMode.toLowerCase(), deckName: deckName}); 
};

const all = async (gameMode) => {
    let decks = await deckModel.find({gameMode: gameMode.toLowerCase()});
    if(decks.length == 0) throw 'Wrong class or there are no decks in this class!';
    return decks;
};

const allFromClass = async (deckClass, gameMode) => {
    if(gameMode) {
        let decks = await deckModel.find({deckClass: deckClass.toLowerCase(), gameMode: gameMode.toLowerCase()});
        if(decks.length == 0) throw 'Wrong class or there are no decks in this GameMode!';
        return decks;
    } else {
        let decks = await deckModel.find({deckClass: deckClass.toLowerCase()});
        if(decks.length == 0) throw 'Wrong class or there are no decks in this class!';
        return decks;
    }
}

module.exports = {
    save: save,
    get: get,
    all: all,
    allFromClass: allFromClass,
};