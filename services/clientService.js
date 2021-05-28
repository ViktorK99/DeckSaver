const deckService = require("./deckService");
const discordPageService = require('./discordPageService');
const Discord = require('discord.js');
const { Menu } = require('discord.js-menu');

const rgxCommandSave = /(!deck) (?<command>save) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>.+?(?= AAE)) (?<deckString>(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==?|[A-Za-z0-9+\/]{3}=?)?) (?<comments>.*)/;
const rgxCommandGet = /(!deck) (?<command>get) (?<gameMode>\w*) (?<deckName>.*)/;
const rgxCommandAll = /(!deck) (?<command>all) (?<gameMode>\w*)/;
const rgxCommandAllFromClass = /(!deck) (?<command>allClass) (?<deckClass>\w*) ?(?<gameMode>\w*)?/;
const rgxCommandDelete = /(!deck) (?<command>delete) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>.*)/;
const rgxCommandEdit = /(!deck) (edit) (?<editDeckPart>\w*) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>.+?) = (?<editedPart>.*)/;

const editCommands = ['gameMode','deckName','deckClass','deckString','deckComments'];

module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', (msg) => {
        let message = msg.content;
        if(msg.author.id == process.env.DISCORD_ID) return;

        if (rgxCommandSave.test(message)) {
            let { gameMode, deckClass, deckName, deckString, comments } = rgxCommandSave.exec(message).groups;

            gameMode = gameMode.toLowerCase();
            deckClass = deckClass.toLowerCase();

            deckService.save(gameMode, deckClass, deckName, deckString, comments, msg.guild.id)
                .then((deck) => {
                    msg.reply(`${deck.deckName} has been saved.`);
                })
                .catch((err) => {
                    msg.reply(Object.keys(err.errors).map(x => err.errors[x].properties.message)[0]);
                })
            
        } else if (rgxCommandGet.test(message)) {
            const { gameMode, deckName } = rgxCommandGet.exec(message).groups;

            deckService.get(gameMode, deckName, msg.guild.id)
                .then((deck) => {
                    if (deck == null) throw 'Deck not Found';
                    const discordMessage = new Discord.MessageEmbed()
                    .setColor('0099ff')
                    .setTitle(deck.deckName)
                    .setDescription(deck.gameMode.toUpperCase())
                    .setThumbnail('https://i.imgur.com/Rd3ygmZ.png')
                    .addField(deck.deckClass.toUpperCase(), deck.deckString,);

                    if (deck.deckComments != '') {
                        discordMessage.fields.push({name: 'Comments', value: deck.deckComments});
                    };
                        msg.channel.send(discordMessage);
                })
                .catch((error) => {msg.reply(error)})
        } else if (rgxCommandAll.test(message)) {
            const { gameMode } = rgxCommandAll.exec(message).groups;

            deckService.all(gameMode, msg.guild.id)
                .then((decks) => {
                    discordPageService.createPage(decks, msg);
                })
                .catch((err) => {msg.reply(err)})
        } else if (rgxCommandAllFromClass.test(message)) {
            const { deckClass, gameMode} = rgxCommandAllFromClass.exec(message).groups;

            deckService.allFromClass(deckClass, gameMode, msg.guild.id)
                .then(decks => {
                    discordPageService.createPage(decks, msg);
                })
                .catch((error) => {msg.reply(error)})
        } else if (rgxCommandDelete.test(message)) {
            const { gameMode, deckClass, deckName } = rgxCommandDelete.exec(message).groups;
            
            deckService.deleteDeck(gameMode, deckClass, deckName, msg.guild.id)
                .then((deck) => {
                    msg.reply(`${deck.deckName} -- ${deck.gameMode.toUpperCase()} has been removed.`);
                })
                .catch((err) => {msg.reply(err)}) 
        } else if (message == '!deck help' || message == '!deck') {
            const discordMessage = new Discord.MessageEmbed()
                    .setColor('0099ff')
                    .setTitle('Help Options')
                    .setThumbnail('https://i.imgur.com/Rd3ygmZ.png')
                    .addFields(
                        {name: 'Save a deck', value: '!deck save [mode] [Class] [Deck Name] [deckstring] [(Optional)comment]'},
                        {name: 'Get one deck', value: '!deck get [mode] [deckname]'},
                        {name: 'Get all decks from a GameMode', value: '!deck all [mode]'},
                        {name: 'Get all decks from a Class', value: '!deck allClass [class] [(Optional)mode]'},
                        {name: 'Delete a deck', value: '!deck delete [mode] [deckClass] [deckName]'},
                        {name: 'Edit a deck',value: '!deck edit mode/name/class/deckString/Comment [Mode] [Class] [Name] = "What you want to be after edit"'},
                    )
            msg.channel.send(discordMessage);
        } else if (rgxCommandEdit.test(message)) {
            const { editDeckPart, gameMode, deckClass, deckName, editedPart } = rgxCommandEdit.exec(message).groups;
            const commandToText = {
                name: 'deckName',
                class: 'deckClass',
                gameMode: 'gameMode',
                deckString:'deckString',
                comment: 'deckComments',
            }

            if(editCommands.includes(commandToText[editDeckPart])) {
                deckService.editDeck(gameMode, deckClass, deckName, commandToText[editDeckPart], editedPart, msg.guild.id)
                    .then(() => {
                        msg.reply('Deck has been edited!');
                    })
                    .catch(err => msg.reply(err))
            } else {
                msg.reply('Edit commant must be !deck edit mode/name/class/deckString/Comment = "What you want to be after edit"');
            }
        }
    });
}