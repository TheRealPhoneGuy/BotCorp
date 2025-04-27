const { Client, IntentsBitField, Collection } = require("discord.js"),
  colors = require("colors");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent, // Nécessaire pour lire le contenu des messages
  ],
});
require("dotenv").config();

client.login(process.env.Token);
client.commands = new Collection();
client.interactions = new Collection();
client.color = "Blue";

require("./handlers/registers")(client);

client.on("error", (error) => {
  console.error("❌ Une erreur est survenue :", error);
});
