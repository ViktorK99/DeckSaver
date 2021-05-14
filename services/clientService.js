const deck = require("../models/deckModel");
const deckService = require("./deckService")

let rgxCommandSave = /(?<botCommand>!deck) (?<command>save) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>\w*) (?<deckString>\w*) ?(?<comments>.*)/;
let rgxCommandGet = /(?<botCommand>!deck) (?<command>get) (?<gameMode>\w*) (?<deckName>\w*)/;
let rgxCommandAll = /(?<botCommand>!deck) (?<command>all) (?<gameMode>\w*)/;

module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', (msg) => {
        let message = msg.content;

        if (rgxCommandSave.test(message)) {
            let { gameMode, deckClass, deckName, deckString, comments } = rgxCommandSave.exec(message).groups;
            deckService.save(gameMode, deckClass, deckName, deckString, comments)
                .then((deck) => {
                    msg.reply(`${deck.deckName} has been saved.`);
                })
                .catch((error) => { console.log(error); })
        } else if (rgxCommandGet.test(message)) {
            let { gameMode, deckName } = rgxCommandGet.exec(message).groups;

            deckService.get(gameMode, deckName)
                .then((deck) => {
                    if (deck == null) throw 'Deck not Found';
                    // check if it has comments
                    msg.reply(`${deck.deckName} -- ${deck.deckString}`);
                })
                .catch((error) => { msg.reply(error) })
        } else if (rgxCommandAll.test(message)) {
            let { gameMode } = rgxCommandAll.exec(message).groups;

            deckService.all(gameMode)
                .then((decks) => {
                    decks.forEach((deck) => {
                        if (deck.deckComments == '') {
                            msg.reply(`${deck.deckName} -- ${deck.deckString}`);
                        } else {
                            msg.reply(`${deck.deckName} -- ${deck.deckComments} -- ${deck.deckString}`);
                        }
                    })
                })
                .catch((err) => {msg.reply(err)})
        }
    });
}