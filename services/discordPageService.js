const Discord = require('discord.js');
const { Menu } = require('discord.js-menu');
const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const pageMenu = (decks, msg, pagesLength) => {
    let decksInPage = decks.splice(0, 9);
    let reactions = reactionsCount(decksInPage, msg, decks);
    let page = {
        name: `Page${pagesLength + 1}`,
        content: new Discord.MessageEmbed({
            color: 0x0099ff,
            title: `Page: ${pagesLength + 1}`,
            thumbnail: {
                url: 'https://i.imgur.com/wSTFkRM.png',
            },
            fields: [{
                name: 'Decks',
                value: decksReply(decksInPage),
            }],
            timestamp: new Date(),
            footer: {
                text: 'Some footer text here',
                icon_url: 'https://i.imgur.com/wSTFkRM.png'
            }
        }),
        reactions: reactions
    };
    return page;
};

const decksReply = (decks) => {
    let decksToStrings = '';
    let count = 0;
    decks.forEach(deck => {
        decksToStrings += `${emoji[count]} ${deck.deckName}\n\n`;
        count++;
    });
    return decksToStrings;
};

const reactionsCount = (decksInPage, msg, decks) => {
    let availableDecks = {};
    
    decksInPage.forEach((deck , index) => {
        availableDecks[[emoji[index]]] = function () {
            if (deck.deckComments == '') {
                const discordMessage = new Discord.MessageEmbed()
                    .setColor('0099ff')
                    .setTitle(deck.deckName)
                    .setDescription(deck.gameMode.toUpperCase())
                    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addField(deck.deckClass.toUpperCase(), deck.deckString,)
                    .setTimestamp()
                    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

                msg.channel.send(discordMessage);
            } else {
                const discordMessage = new Discord.MessageEmbed()
                    .setColor('0099ff')
                    .setTitle(deck.deckName)
                    .setDescription(deck.gameMode.toUpperCase())
                    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addFields(
                        {name: deck.deckClass.toUpperCase(), value: deck.deckString},
                        {name: 'Comments', value: deck.deckComments}
                    )
                    .setTimestamp()
                    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

                msg.channel.send(discordMessage);
            };
        }
    })
    if (decks.length > 0) {
        availableDecks = Object.assign(availableDecks, {'➡️': 'next'});
    }
    return availableDecks;
};

module.exports = {
    pageMenu: pageMenu,
};