const deck = require("../models/deckModel");
const deckService = require("./deckService")

let rgxCommandSave = /(?<botCommand>!deck) (?<command>save) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>\w*) (?<deckString>\w*) ?(?<comments>.*)/;
let rgxCommandGet = /(?<botCommand>!deck) (?<command>get) (?<gameMode>\w*) (?<deckName>\w*)/;
let rgxCommandAll = /(?<botCommand>!deck) (?<command>all) (?<gameMode>\w*)/;
let rgxCommandAllFromClass = /(?<botCommand>!deck) (?<command>allClass) (?<deckClass>\w*) ?(?<gameMode>\w*)?/;

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
                    let error = Object.keys(err.errors).map(x => err.errors[x].properties.message);
                    msg.reply(error[0]);
                })
            
        } else if (rgxCommandGet.test(message)) {
            let { gameMode, deckName } = rgxCommandGet.exec(message).groups;

            deckService.get(gameMode, deckName)
                .then((deck) => {
                    if (deck == null) throw 'Deck not Found';

                    if (deck.deckComments == '') {
                        msg.reply(`${deck.deckName} -- ${deck.deckString}`);
                    } else {
                        msg.reply(`${deck.deckName} -- ${deck.deckComments} -- ${deck.deckString}`);
                    };
                })
                .catch((error) => {msg.reply(error)})
        } else if (rgxCommandAll.test(message)) {
            let { gameMode } = rgxCommandAll.exec(message).groups;

            deckService.all(gameMode)
                .then((decks) => {
                    decks.forEach((deck) => {
                        if (deck.deckComments == '') {
                            msg.reply(`${deck.deckClass.toUpperCase()} -- ${deck.deckName} -- ${deck.deckString}`);
                        } else {
                            msg.reply(`${deck.deckClass.toUpperCase()} -- ${deck.deckName} -- ${deck.deckComments} -- ${deck.deckString}`);
                        };
                    });
                })
                .catch((err) => {msg.reply(err)})
        } else if (rgxCommandAllFromClass.test(message)) {
            let { deckClass, gameMode} = rgxCommandAllFromClass.exec(message).groups;

            deckService.allFromClass(deckClass, gameMode)
                .then(decks => {
                    decks.forEach((deck) => {
                        if (deck.deckComments == '') {
                            msg.reply(`${deck.deckName} -- ${deck.gameMode.toUpperCase()} -- ${deck.deckString} `);
                        } else {
                            msg.reply(`${deck.deckName}-- ${deck.gameMode.toUpperCase()} -- ${deck.deckComments} -- ${deck.deckString}`);
                        };
                    });
                })
                .catch((error) => {msg.reply(error)})
        }
    });
}