const deck = require("../models/deckModel");
const deckService = require("./deckService");
const discordPageService = require('./discordPageService');
const Discord = require('discord.js');
const { Menu } = require('discord.js-menu');


let rgxCommandSave = /(!deck) (?<command>\w*) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>.+?) (?<deckString>(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)) ?(?<comments>.*)/;
let rgxCommandGet = /(!deck) (?<command>get) (?<gameMode>\w*) (?<deckName>.*)/;
let rgxCommandAll = /(!deck) (?<command>all) (?<gameMode>\w*)/;
let rgxCommandAllFromClass = /(!deck) (?<command>allClass) (?<deckClass>\w*) ?(?<gameMode>\w*)?/;
let rgxCommandDelete = /(!deck) (?<command>delete) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>\w*)/

module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', (msg) => {
        let message = msg.content;

        if (rgxCommandSave.test(message)) {
            let { gameMode, deckClass, deckName, deckString, comments } = rgxCommandSave.exec(message).groups;

            gameMode = gameMode.toLowerCase();
            deckClass = deckClass.toLowerCase();

            deckService.save(gameMode, deckClass, deckName, deckString, comments)
                .then((deck) => {
                    msg.reply(`${deck.deckName} has been saved.`);
                })
                .catch((err) => {
                    msg.reply(Object.keys(err.errors).map(x => err.errors[x].properties.message)[0]);
                })
            
        } else if (rgxCommandGet.test(message)) {
            const { gameMode, deckName } = rgxCommandGet.exec(message).groups;

            deckService.get(gameMode, deckName)
                .then((deck) => {
                    if (deck == null) throw 'Deck not Found';
                    const discordMessage = new Discord.MessageEmbed()
                    .setColor('0099ff')
                    .setTitle(deck.deckName)
                    .setDescription(deck.gameMode.toUpperCase())
                    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addField(deck.deckClass.toUpperCase(), deck.deckString,)
                    .setTimestamp()
                    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

                    if (deck.deckComments != '') {
                        discordMessage.fields.push({name: 'Comments', value: deck.deckComments});
                    };
                        msg.channel.send(discordMessage);
                })
                .catch((error) => {msg.reply(error)})
        } else if (rgxCommandAll.test(message)) {
            let { gameMode } = rgxCommandAll.exec(message).groups;

            deckService.all(gameMode)
                .then((decks) => {
                    discordPageService.createPage(decks, msg);
                })
                .catch((err) => {msg.reply(err)})
        } else if (rgxCommandAllFromClass.test(message)) {
            let { deckClass, gameMode} = rgxCommandAllFromClass.exec(message).groups;

            deckService.allFromClass(deckClass, gameMode)
                .then(decks => {
                    discordPageService.createPage(decks, msg);
                })
                .catch((error) => {msg.reply(error)})
        } else if (rgxCommandDelete.test(message)) {
            const { gameMode, deckClass, deckName } = rgxCommandDelete.exec(message).groups;
            
            deckService.deleteDeck(gameMode, deckClass, deckName)
                .then((deck) => {
                    msg.reply(`${deck.deckName} -- ${deck.gameMode.toUpperCase()} has been removed`);
                })
                .catch((err) => {msg.reply(err)}) 
        } 
    });
}