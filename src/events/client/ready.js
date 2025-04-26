const { Events, ActivityType, Client } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.ClientReady,

  /**
   * @param {Client} client
   */
  async run(client) {
    try {
      console.log(
        colors.white(
          `Connectée en tant que ${colors[`bright` + client.color](
            client.user.tag
          )}.`
        )
      );
      client.user.setActivity("🚧 En développement", {
        type: ActivityType.Custom,
      });

      // Enregistrer les commandes slash
      await client.application.commands.set(
        client.commands.map((cmd) => cmd.data)
      );
      console.log(colors.white(`Commandes modifié sur discord`));
    } catch (err) {
      console.log(err);
    }
  },
};
