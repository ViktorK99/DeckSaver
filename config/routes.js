const { Router } = require('express');
const router = Router();
const passport = require('passport');
const deckService = require('../services/deckService');
const discordController = require('../controllers/discordController');
const mongoose = require('mongoose');
const {decode} = require('deckstrings');
const fs = require('fs');


let scopes = ['identify', 'guilds'];
let prompt = 'consent';

router.get('/auth/discordLogin', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
router.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/discord/about' }), function(req, res) {res.redirect('/discord/decks')} // auth success
);
router.use('/discord', discordController);

router.post('/getDeck', function(req, res) {
    const { guildId, deckId } = req.body;
    let deckModel = require('../models/DeckModel')(guildId)

    deckModel.findById(deckId, (err, deck) => {
        let cardsInDeck = [];
        const {cards} = decode(deck.deckString);
        const allcards = JSON.parse(fs.readFileSync('C:/Projects/DeckSaver/cards/cards.json'));
        cards.forEach(card => {
            const foundCard = allcards.find(a => card[0] == a.dbfId);
            cardsInDeck.push([foundCard, card[1]])
        });
        res.json({deck: deck, cardsInDeck: cardsInDeck})
    })
});

router.get('/home', (req, res) => {
    res.render('home')
})
router.get('/about', (req, res) => {
    res.render('about')
});
router.get('/', (req, res) => {
    res.redirect('/home')
})
module.exports = router