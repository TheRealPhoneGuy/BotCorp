const { Client, IntentsBitField, Collection } = require("discord.js"),
  colors = require("colors");
const client = new Client({ intents: 53608447 });
require("dotenv").config();

client.login(process.env.Token);
client.commands = new Collection();
client.color = "Blue";

require("./handlers/registers")(client);
