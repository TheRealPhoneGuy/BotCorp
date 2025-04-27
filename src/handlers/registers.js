const { readdirSync, statSync } = require("fs");
const { ApplicationCommandType } = require("discord.js");
const colors = require("colors");

module.exports = (client) => {
  let eventCount = 0;
  let commandCount = 0;
  let interactionCount = 0;

  console.log(colors.blue("🔄 Début du chargement des événements..."));

  readdirSync("./src/events").forEach((dir) => {
    const fullPath = `./src/events/${dir}`;
    if (statSync(fullPath).isDirectory()) {
      console.log(colors.green(`📂 Chargement du dossier d'événements : ${dir}`));
      readdirSync(fullPath)
        .filter((f) => f.endsWith(".js"))
        .forEach((file) => {
          console.log(colors.yellow(`🔍 Chargement de l'événement : ${file}`));
          const event = require(`../events/${dir}/${file}`);
          const eventHandler = event.run || event.execute;
          if (eventHandler) {
            client.on(event.name, (...args) => eventHandler(client, ...args));
            eventCount++;
          }
        });
    } else if (dir.endsWith(".js")) {
      console.log(colors.yellow(`🔍 Chargement de l'événement : ${dir}`));
      const event = require(`../events/${dir}`);
      const eventHandler = event.run || event.execute;
      if (eventHandler) {
        client.on(event.name, (...args) => eventHandler(...args, client));
        eventCount++;
      }
    }
  });

  console.log(colors.blue("🔄 Début du chargement des commandes..."));

  readdirSync("./src/commands").forEach((dir) => {
    console.log(colors.green(`📂 Chargement du dossier de commandes : ${dir}`));
    readdirSync(`./src/commands/${dir}`)
      .filter((f) => f.endsWith(".js"))
      .forEach((file) => {
        console.log(colors.yellow(`🔍 Chargement de la commande : ${file}`));
        const command = require(`../commands/${dir}/${file}`);
        if (command.data.type === ApplicationCommandType.User)
          delete command.data.description;
        client.commands.set(command.data.name, command);
        commandCount++;
      });
  });

  console.log(colors.blue("🔄 Début du chargement des interactions..."));

  const dirsInteractions = readdirSync("./src/interactions/");
  for (const dirs of dirsInteractions) {
    console.log(colors.green(`📂 Chargement du dossier d'interactions : ${dirs}`));
    const filesDirs = readdirSync(`./src/interactions/${dirs}/`).filter((f) =>
      f.endsWith(".js")
    );
    for (const files of filesDirs) {
      console.log(colors.yellow(`🔍 Chargement de l'interaction : ${files}`));
      const interaction = require(`../interactions/${dirs}/${files}`);
      client.interactions.set(interaction.name, interaction);
      interactionCount++;
    }
  }

  console.log(
    colors.white(
      `${colors["bright" + client.color](String(eventCount))} événements, ${colors["bright" + client.color](
        String(interactionCount)
      )} interactions et ${colors["bright" + client.color](String(commandCount))} commandes`
    )
  );
};
