const deckService = require("./deckService")

let rgxCommandSave = /(?<botCommand>!deck) (?<command>save) (?<gameMode>\w*) (?<deckClass>\w*) (?<deckName>\w*) (?<deckString>\w*) ?(?<comments>.*)/;
let rgxCommandGet = /(?<botCommand>!deck) (?<command>get) (?<gameMode>\w*) (?<deckName>\w*)/;
module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', (msg) => {
        let message = msg.content;
        if (rgxCommandSave.test(message)) {
            let {gameMode, deckClass, deckName, deckString, comments} = rgxCommandSave.exec(message).groups;
            // check if it has comments
            deckService.save(gameMode, deckClass, deckName, deckString, comments)
                .then((deck) => {
                    msg.reply(`${deck.deckName} has been saved.`);
                })
                .catch((error) => { console.log(error); })
        } else if (rgxCommandGet.test(message)) {
            let {gameMode, deckName} = rgxCommandGet.exec(message).groups;
            
            deckService.get(gameMode, deckName)
                .then((deck) => {
                    if (deck == null ) throw 'Deck not Found';
                    msg.reply(`${deck.deckName} -- ${deck.deckString}`);   
                })
                .catch((error) => {msg.reply(error)})
        }
    });
}