const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
let deckModel;
const deckService = require('../services/deckService');

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
router.get('/decks/:guildId', (req, res) => {
    mongoose.connection.db.listCollections().toArray((error, collections) => {
        req.user.guilds = req.user.guilds.filter(function (o1) {
            return collections.some(function (o2) {
                return o1.id === o2.name;
            });
        });
        let decks = [];
        
        new Promise((resolve, reject) => {
                let decks = {};
                req.user.guilds.forEach((guild, index, array) => {
                    deckModel = require('../models/deckModel')(guild.id);
                    deckModel.find({}).lean().exec((err, currentDecks) => {

                        if(currentDecks !== null) {
                            decks[guild.name] = currentDecks
                        };
                        if (index === array.length -1) resolve(decks);
                    })
                        
                });
            }).then((discordDecks) => {
                res.render('decks',{discordDecks: discordDecks})
            })
    })
});
module.exports = router;