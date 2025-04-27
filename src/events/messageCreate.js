const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "./autoreact.json");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    try {
      console.log("📩 Nouveau message reçu dans le salon", message.channel.id);

      if (message.author.bot) return;

      if (!fs.existsSync(filePath)) {
        console.log("❌ Le fichier autoreact.json n'existe pas.");
        return;
      }

      const autoreacts = JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log("📂 Autoreacts chargés :", autoreacts);

      for (const ar of autoreacts) {
        console.log(
          `🔍 Vérification : Salon ${ar.channelId}, Mot "${ar.word}", Emoji ${ar.emoji}`
        );
        if (message.channel.id === ar.channelId && message.content.includes(ar.word)) {
          try {
            console.log(`✅ Correspondance trouvée, ajout de la réaction ${ar.emoji}`);
            await message.react(ar.emoji);
          } catch (error) {
            console.error(`❌ Impossible d'ajouter une réaction : ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Erreur dans l'événement messageCreate : ${error.message}`);
    }
  },
};