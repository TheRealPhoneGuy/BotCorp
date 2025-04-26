const { Client, IntentsBitField } = require("discord.js"),
  colors = require("colors");
const client = new Client({ intents: 53608447 });
require("dotenv").config();

client.login(process.env.Token);
client.color = "Blue";

client.once("ready", () => {
  console.log(
    colors.white(
      `Connectée en tant que ${colors[`bright` + client.color](
        client.user.tag
      )}.`
    )
  );
});
