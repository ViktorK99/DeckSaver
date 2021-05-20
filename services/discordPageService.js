const Discord = require('discord.js');
const { Menu } = require('discord.js-menu');
const numbersArray = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const pageMenu = (decks, msg, pagesLength) => {
    const decksInPage = decks.splice(0, 9);
    const reactions = reactionsCount(decksInPage, msg, decks);

    return page = {
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
};

const decksReply = (decks) => {
    let decksToStrings = '';
    
    decks.forEach((deck,index) => {
        decksToStrings += `${numbersArray[index]} ${deck.deckName}\n\n`;
    });
    return decksToStrings;
};

const reactionsCount = (decksInPage, msg, decks) => {
    let availableDecks = {};
    
    decksInPage.forEach((deck , index) => {
        availableDecks[[numbersArray[index]]] = function () {

            const discordMessage = new Discord.MessageEmbed()
                .setColor('0099ff')
                .setTitle(deck.deckName)
                .setDescription(deck.gameMode.toUpperCase())
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addField(deck.deckClass.toUpperCase(), deck.deckString,)
                .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

            if (deck.deckComments != '') {
                discordMessage.fields.push({name: 'Comments', value: deck.deckComments});
            };
            msg.channel.send(discordMessage);
        };
    });
    if (decks.length > 0) {
        availableDecks = Object.assign(availableDecks, {'➡️': 'next'});
    };
    return availableDecks;
};

const createPage = (decks, msg) => {
    let pages = [];
    while (decks.length > 0) {
        pages.push(pageMenu(decks, msg, pages.length));
    };
    let helpMenu = new Menu(msg.channel, msg.author.id, pages);

    helpMenu.start();

    helpMenu.on('pageChange', destination => {
        if (destination.name != 'Page1') {
            destination.reactions = Object.assign({'⬅️': 'previous'}, destination.reactions);
        };
    });
};

module.exports = {
    pageMenu: pageMenu,
    createPage: createPage,
};