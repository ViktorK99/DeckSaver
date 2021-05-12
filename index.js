const env = process.env.NODE_ENV || 'development';

const config = require('./config/config.env')[env];
const express = require('express');
const Discord = require('discord.js');

const client = new Discord.Client();
const app = express();

require('./config/mongoose')(config);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on('message', (message) => {
    console.log('yo');
});

client.login(config.discordToken);
app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));