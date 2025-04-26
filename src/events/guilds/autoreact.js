const { Events, Message } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.MessageCreate,

  /**
   *
   * @param {Message} message
   */
  async run(client, message) {
    try {
      let reaction;
      
      switch (message.channelId) {
        case "1357838689811824944":
          reaction = "<:annonce:1363469971824312500>";
          break; // Ajouté un break pour éviter des cas successifs
        case "1358137495425912852":
          reaction = "<:wumpus:1363470030913929347>";
          break;
        default:
          reaction = undefined; // Optionnel, pour clarifier
      }

      if (!reaction) return; // Vérification pour éviter un appel de réaction inutile
      await message.react(reaction);
    } catch (err) {
      console.error(err); // Utilisé console.error pour un meilleur logging des erreurs
    }
  },
};
