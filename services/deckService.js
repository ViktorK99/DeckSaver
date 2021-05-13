const deckModel = require('../models/deckModel');

const save = (gameMode, deckClass, deckName, deckString, deckComments) => {
    let deck = new deckModel({
        gameMode: gameMode,
        deckName: deckName,
        deckClass: deckClass,
        deckString: deckString,
        deckComments: deckComments,
    });
    return deck.save();
};

const get = async(gameMode, deckName) => {
    return await deckModel.findOne({gameMode: gameMode, deckName: deckName}); 
}

module.exports = {
    save: save,
    get: get,
}