const { Events, Client } = require("discord.js");

module.exports = {
  name: Events.ClientReady,

  /**
   * @param {Client} client
   */
  async run(client) {
    try {
      console.log(`${client.user.tag} est prêt !`);
    } catch (err) {
      console.error(err); // Utilisé console.error pour un meilleur logging des erreurs
    }
  },
};