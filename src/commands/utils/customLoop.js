const { SlashCommandBuilder, ChannelType } = require("discord.js");

let loopInterval = null; // Variable pour stocker l'intervalle

module.exports = {
  data: new SlashCommandBuilder()
    .setName("customloop")
    .setDescription("Automatise l'envoi de messages ou de commandes dans un salon.")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Démarrer ou arrêter la boucle.")
        .setRequired(true)
        .addChoices(
          { name: "Démarrer", value: "start" },
          { name: "Arrêter", value: "stop" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Le salon où envoyer les messages.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Le message ou la commande à envoyer.")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("intervalle")
        .setDescription("Intervalle en secondes entre chaque message.")
        .setRequired(false)
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    const action = interaction.options.getString("action");
    const channel = interaction.options.getChannel("salon");
    const message = interaction.options.getString("message") || "/bump";
    const interval = interaction.options.getInteger("intervalle") || 3600; // Par défaut, 1 heure (3600 secondes)

    if (action === "start") {
      if (loopInterval) {
        return interaction.reply({
          content: "❌ Une boucle est déjà en cours.",
          ephemeral: true,
        });
      }

      // Convertir l'intervalle en millisecondes
      const intervalMs = interval * 1000;

      // Démarrer la boucle
      loopInterval = setInterval(async () => {
        try {
          await channel.send(message);
        } catch (error) {
          console.error("Erreur lors de l'envoi du message :", error);
        }
      }, intervalMs);

      return interaction.reply({
        content: `✅ La boucle a été démarrée dans le salon ${channel} avec un intervalle de ${interval} secondes.`,
        ephemeral: true,
      });
    } else if (action === "stop") {
      if (!loopInterval) {
        return interaction.reply({
          content: "❌ Aucune boucle n'est en cours.",
          ephemeral: true,
        });
      }

      // Arrêter la boucle
      clearInterval(loopInterval);
      loopInterval = null;

      return interaction.reply({
        content: `✅ La boucle a été arrêtée.`,
        ephemeral: true,
      });
    }
  },
};