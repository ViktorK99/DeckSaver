const deckService = require("./deckService")

let rgxCommandSave = /(?<botCommand>!deck)\s(?<command>save)\s(?<gameMode>\S*)\s(?<deckClass>\S*)\s(?<deckName>\S*)\s(?<deckString>\S*)\s?(?<commentars>.*)/;
let rgxCommandGet = /(?<botCommand>!deck)\s(?<command>get)\s(?<gameMode>\S*)\s(?<deckName>\S*)/
module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', (msg) => {
        let message = msg.content;

        if (rgxCommandSave.test(message)) {
            let regexMessage = rgxCommandSave.exec(message).groups;

            deckService.save(regexMessage.gameMode, regexMessage.deckClass, regexMessage.deckName, regexMessage.deckString, regexMessage.commentars)
                .then((deck) => {
                    msg.reply(`${deck.deckName} has been saved.`)
                })
                .catch((error) => { console.log(error); })
        } else if (rgxCommandGet.test(message)) {
            let {gameMode, deckName} = rgxCommandGet.exec(message).groups;
            
            deckService.get(gameMode, deckName)
            .then((deck) => {
                msg.reply(`${deck.deckName} -- ${deck.deckString}`)   
            })
        }
    });
}