const config = require('./config/config');
const express = require('express');
const Discord = require('discord.js');

const client = new Discord.Client()
const app = express();

require('./config/mongoose')()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
  });

client.on("message", (message) => {
    console.log('yo');
});

client.login(config.development.discordToken);
app.listen(config.development.port, console.log(`Listening on port ${config.development.port}! Now its up to you...`));