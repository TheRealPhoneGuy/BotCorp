const fs = require("fs");
const path = require("path");

const logFilePath = path.resolve(__dirname, "./autoreact.log");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    try {
      // Ignorer les messages des bots
      if (message.author.bot) return;

      let reaction;
      let debugMessage;

      // Logique pour les autoreacts
      switch (message.channel.id) {
        case "1357838689811824944":
          reaction = "<:annonce:1363469971824312500>";
          debugMessage = `📩 [Salon: ${message.channel.id}] Message reçu : "${message.content}" - Réaction ajoutée : ${reaction}`;
          break;

        case "1358137495425912852":
          reaction = "<:wumpus:1363470030913929347>";
          debugMessage = `📩 [Salon: ${message.channel.id}] Message reçu : "${message.content}" - Réaction ajoutée : ${reaction}`;
          break;
        
        case "your_channel_id_here": // Remplacez par l'ID de votre salon
          reaction = "your_reaction_here"; // Remplacez par la réaction souhaitée
          debugMessage = `📩 [Salon: ${message.channel.id}] Message reçu : "${message.content}" - Réaction ajoutée : ${reaction}`;
        	break;
  
        default:
          return; // Ne rien faire si le message n'est pas dans les salons ciblés
      }

      // Ajouter la réaction au message
      if (reaction) {
        await message.react(reaction);
      }

      // Envoyer le message de débogage dans la console
      console.log(debugMessage);

      // Écrire le message de débogage dans le fichier autoreact.log
      fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${debugMessage}\n`);
    } catch (error) {
      console.error(`❌ Erreur dans l'événement messageCreate : ${error.message}`);
    }
  },
};