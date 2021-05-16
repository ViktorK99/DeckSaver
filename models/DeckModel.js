const mongoose = require('mongoose');
const isBase64 = require('is-base64');

const DeckShema = new mongoose.Schema({
    gameMode: {
        type: String,
        required: true,
        validate: {
            validator: (string) => {
                let gameMode = string;
                if (gameMode == 'classic' || gameMode == 'standard' || gameMode == 'wild' || gameMode == 'duels' || gameMode == 'casual') {
                    return true;
                } else {
                    return false;
                };
            },
            message: () => {
                return 'Deck format must be Classic/Standard/Wild/Casual/Duels';
            }
        }
    },
    deckName: {
        type: String,
        required: true,
    },
    deckClass: {
        type: String,
        required: true,
        validate: {
            validator: (string) => {
                let deckClass = string;
                if(deckClass == 'demonhunter' || deckClass == 'druid' || deckClass == 'hunter' ||
                   deckClass == 'mage' || deckClass == 'paladin' || deckClass == 'priest' || deckClass == 'rogue' ||
                   deckClass == 'shaman' || deckClass == 'warlock' || deckClass == 'warrior') {

                    return true;
                } else {
                    return false;
                };
            },
            message: () => {
                return `Deck Class must be DemonHunter/Druid/Hunter/Mage/Paladin/Priest/Rogue/Shaman/Warlock/Warrior`;
            }
        }
    },
    deckString: {
        type: String,
        required: true,
        validate: {
            validator: (string) => {
                return isBase64(string);
            },
            message: () => {
                return `Invalide DeckString`;
            }
        }
    },
    deckComments: {
        type: String,
    }
});

const deck = mongoose.model('Decks', DeckShema);

module.exports = deck;