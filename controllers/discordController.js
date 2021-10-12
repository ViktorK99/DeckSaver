const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
let deckModel;
const deckService = require('../services/deckService');
const {decode} = require('deckstrings');
const fs = require('fs');
const isBase64 = require('is-base64');
const passport = require('passport');
const auth = require('../middleware/auth');
 
router.get('/servers', (req, res) => {
    mongoose.connection.db.listCollections().toArray((error, collections) => {
        req.user.guilds = req.user.guilds.filter(function (o1) {
            return collections.some(function (o2) {
                return o1.id === o2.name;
            });
        })

        new Promise((resolve, reject) => {
            req.user.guilds.forEach((guild, index, array) => {
                deckModel = require('../models/deckModel')(guild.id);
                deckModel.countDocuments().then(x => {
                    req.user.guilds[index].deckCount = x;
                    if (index === array.length - 1) resolve();
                });
            })
        }).then(() => {
            res.render('servers', { discordServer: req.user.guilds });
        })
    });
});
router.get('/decks',auth, (req, res) => {
    if (req.user) {
        if (req.user.guilds != undefined) {
            mongoose.connection.db.listCollections().toArray(async (error, collections) => {
                req.user.guilds = req.user.guilds.filter(function (o1) {
                    return collections.some(function (o2) {
                        return o1.id === o2.name;
                    });
                });
        
                let allDecks = {};
        
                for (let guild of req.user.guilds.values()) {
                    deckModel = require('../models/deckModel')(guild.id);
                    let guildDecks = await deckModel.find({}).lean().exec();
                    guildDecks.forEach((currentDeck , index) => {
                        if (index <= 9) {
                            allDecks[guild.name] = Object.assign({[index]: JSON.parse(JSON.stringify(currentDeck))}, allDecks[guild.name]); 
                        }
                    });
                };
        
                let sorted = Object.keys(allDecks).sort().reduce((obj, key) => {
                    obj[key] = allDecks[key];
                    return obj;
                },
                {});
                res.render('decks',{discordDecks: sorted , isLoggedIn: req.isLoggedIn});
            })
        }
    }else {
            res.redirect('/home')
        }
});

router.get('/addDecks',auth, (req, res) => {
    mongoose.connection.db.listCollections().toArray(async (error, collections) => {
        req.user.guilds = req.user.guilds.filter(function (o1) {
            return collections.some(function (o2) {
                return o1.id === o2.name;
            });
        });
        res.render('addDecks', { discordServer: req.user.guilds, isLoggedIn: req.isLoggedIn})
    })
})

router.post('/addDecks',auth, (req, res) => {
    const {deckName, deckClass, gameMode, deckString, deckComment, guildId} = req.body;
    if (deckName != '' && deckClass != '' && gameMode != '' && deckString != '' && guildId != '' && isBase64(deckString)) {
        deckService.save(gameMode, deckClass, deckName, deckString, deckComment, guildId)
            .then(deck => {
                res.redirect('/discord/decks')
            })
    } else {
        res.render('addDecks', { discordServer: req.user.guilds, isLoggedIn: req.isLoggedIn, error: true})
    }
})

router.get('/decks/:guildId/:deckId',auth, (req, res) => {
    const {guildId, deckId} = req.params;
    deckModel = require('../models/deckModel')(guildId);
    deckModel.findById(deckId).lean().exec((err, deck) => {
        let cardsInDeck = [];
        const {cards} = decode(deck.deckString);
        const allcards = JSON.parse(fs.readFileSync('C:/Projects/DeckSaver/cards/cards.json'));
        cards.forEach(card => {
            const foundCard = allcards.find(a => card[0] == a.dbfId);
            cardsInDeck.push([foundCard, card[1]])
        });

        const sortedCardsInDeck = cardsInDeck.sort((a, b) => {
            if (a[0].cost > b[0].cost) {
                return 1;
            } else if (a[0].cost < b[0].cost) {
                return -1;
            } else {
                a[0].name.localeCompare(b[0].name);
            }
        })
        res.render('deck', {deck: deck, cardsInDeck:sortedCardsInDeck, isLoggedIn: req.isLoggedIn})
    });
})
router.get('/commands', auth, (req, res) => {
    res.render('botCommands', {isLoggedIn: req.isLoggedIn})
});
module.exports = router;