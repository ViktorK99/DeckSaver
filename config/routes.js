const { Router } = require('express');
const router = Router();
const passport = require('passport');
const deckService = require('../services/deckService');
const mongoose = require('mongoose');
let deckModel;


let scopes = ['identify', 'guilds'];
let prompt = 'consent';

router.get('/', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
router.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/fail' }), function(req, res) { res.redirect('/home') } // auth success
);

router.get('/home', (req, res) => {
    mongoose.connection.db.listCollections().toArray((error, collections) => { 
        req.user.guilds = req.user.guilds.filter(function(o1){
            return collections.some(function(o2){
                return o1.id === o2.name;
            });
        })

        new Promise((resolve, reject) => {
            req.user.guilds.forEach((guild, index, array) => {
                deckModel = require('../models/deckModel')(guild.id);
                deckModel.countDocuments().then(x => {
                    req.user.guilds[index].deckCount = x;
                    if (index === array.length -1) resolve();
                });
            })
        }).then(() => {
            res.render('index', {discordServer:req.user.guilds});
        })

    });
    // new Promise((resolve, reject) => {
    //     let decks = [];
    //     req.user.guilds.forEach((x, index, array) => {
    //         deckService.webAll(x.id).exec().then((currentDeck) => {
    //             if(currentDeck !== null) {
    //                 decks.push(currentDeck);
    //             };
    //             if (index === array.length -1) resolve(decks);
    //         });
    //     });
    // }).then((fetchedDecks) => {
    //     console.log(fetchedDecks);
    // })
    
})
module.exports = router