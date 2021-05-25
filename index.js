require('dotenv').config();

const express = require('express');
const Discord = require('discord.js');
const client = new Discord.Client();
const app = express();
const routes = require('./config/routes');

require('./config/express')(app);
require('./config/passport')(app);
require('./config/mongoose')();
require('./services/clientService')(client);

app.use(routes)

client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT, console.log(`Listening on port ${process.env.PORT}! Now its up to you...`));
