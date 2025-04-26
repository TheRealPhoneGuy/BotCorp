const { Events, Client } = require("discord.js");

module.exports = {
  name: Events.ClientReady,

  /**
   *
   * @param {Client} client
   */
  async run(client) {
    try {
      console.log(`${client.user.tag} est prêt !`);

      // ID du canal où envoyer le message
      const channelId = "1365816460122919033";

      // Lancer un intervalle pour envoyer un message toutes les 2 heures (7200000 ms)
      setInterval(() => {
        const channel = client.channels.cache.get(channelId);
        if (!channel) {
          console.error("Canal non trouvé !");
          return;
        }

        // Envoyer un message dans le canal
        channel
          .send("Ceci est un message envoyé toutes les 2s.")
          .catch(console.error); // En cas d'erreur
      }, 2000); //7200000 // 2 heures en millisecondes
    } catch (err) {
      console.error(err); // Utilisé console.error pour un meilleur logging des erreurs
    }
  },
};
