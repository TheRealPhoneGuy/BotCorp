const { readdirSync } = require("fs");
const { ApplicationCommandType } = require("discord.js");
const colors = require("colors");

module.exports = (client) => {
  let eventCount = 0;
  let commandCount = 0;
  let interactionCount = 0;

  // Charger les événements
  readdirSync("./src/events").forEach((dir) => {
    readdirSync(`./src/events/${dir}`)
      .filter((f) => f.endsWith(".js"))
      .forEach((file) => {
        const event = require(`../events/${dir}/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
        eventCount++;
      });
  });

  // Charger les commandes
  readdirSync("./src/commands").forEach((dir) => {
    readdirSync(`./src/commands/${dir}`)
      .filter((f) => f.endsWith(".js"))
      .forEach((file) => {
        const command = require(`../commands/${dir}/${file}`);
        if (command.data.type === ApplicationCommandType.User)
          delete command.data.description;
        client.commands.set(command.data.name, command);
        commandCount++;
      });
  });

  const dirsInteractions = readdirSync("./src/interactions/");

  for (const dirs of dirsInteractions) {
    const filesDirs = readdirSync(`./src/interactions/${dirs}/`).filter((f) =>
      f.endsWith(".js")
    );
    for (const files of filesDirs) {
      const interaction = require(`../interactions/${dirs}/${files}`);
      client.interactions.set(interaction.name, interaction);
      interactionCount++;
    }
  }

  // Log du nombre d'événements et de commandes
  console.log(
    colors.white(
      `${colors["bright" + client.color](
        String(eventCount)
      )} événements, ${colors["bright" + client.color](
        String(interactionCount)
      )} interraction et ${colors["bright" + client.color](
        String(commandCount)
      )} commandes`
    )
  );
};
