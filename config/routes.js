const { Router } = require('express');
const router = Router();
const passport = require('passport');
const deckService = require('../services/deckService');
const discordController = require('../controllers/discordController')
const mongoose = require('mongoose');
let deckModel;


let scopes = ['identify', 'guilds'];
let prompt = 'consent';

router.get('/', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
router.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/fail' }), function(req, res) { res.redirect('/discord/servers') } // auth success
);
router.use('/discord', discordController)
router.get('/home', (req, res) => {
    

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