const { Client, IntentsBitField, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

require("dotenv").config();

client.login(process.env.TOKEN);
client.commands = new Collection();
client.interactions = new Collection();
client.color = "Blue";

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on("error", (error) => console.error("❌ Une erreur est survenue :", error));

require("./handlers/registers")(client);
