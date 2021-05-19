const mongoose = require('mongoose');
const isBase64 = require('is-base64');
const correctDeckClass = ['deamonhunter', 'druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
const correctGameModes = ['classic', 'standard', 'wild', 'duels', 'casual'];

const DeckShema = new mongoose.Schema({
    gameMode: {
        type: String,
        required: true,
        validate: {
            validator: (gameMode) => {
                if (correctGameModes.includes(gameMode)) {
                    return true;
                }
                return false;
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
            validator: (deckClass) => {
                if(correctDeckClass.includes(deckClass)) {
                    return true;
                }
                return false;
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
            validator: (deckString) => {
                return isBase64(deckString);
            },
            message: () => {
                return `Invalid DeckString`;
            }
        }
    },
    deckComments: {
        type: String,
    }
});

const deck = mongoose.model('Decks', DeckShema);

module.exports = deck;