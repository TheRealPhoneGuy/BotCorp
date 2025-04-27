const { SlashCommandBuilder, ChannelType } = require("discord.js");

const loops = new Map(); // Stocker les boucles par salon

module.exports = {
  data: new SlashCommandBuilder()
    .setName("customloop")
    .setDescription(
      "Automatise l'envoi de messages ou de commandes dans un salon."
    )
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
    try {
      const action = interaction.options.getString("action");
      const channel = interaction.options.getChannel("salon");
      const message = interaction.options.getString("message") || "/bump";
      const interval = interaction.options.getInteger("intervalle") || 7200; // Par défaut, 2 heures (7200 secondes)

      // Vérifier les permissions
      const clientChannel = interaction.client.channels.cache.get(channel.id);

      // Vérifiez si le canal existe
      if (!clientChannel) {
        return interaction.reply({
          content: "❌ Le canal spécifié est introuvable.",
          flags: 64, // Réponse éphémère
        });
      }

      // Vérifiez si le bot a les permissions nécessaires
      if (
        !clientChannel
          .permissionsFor(interaction.guild.members.me)
          ?.has("SendMessages")
      ) {
        return interaction.reply({
          content:
            "❌ Je n'ai pas la permission d'envoyer des messages dans ce canal.",
          flags: 64, // Réponse éphémère
        });
      }

      // Vérifier l'intervalle
      if (interval < 10 || interval > 86400) {
        return interaction.reply({
          content:
            "❌ L'intervalle doit être compris entre 10 secondes et 24 heures.",
          flags: 64, // Réponse éphémère
        });
      }

      if (action === "start") {
        if (loops.has(channel.id)) {
          return interaction.reply({
            content: "❌ Une boucle est déjà en cours dans ce salon.",
            flags: 64, // Réponse éphémère
          });
        }

        // Démarrer la boucle
        const intervalMs = interval * 1000;
        const loop = setInterval(async () => {
          try {
            await channel.send(message);
          } catch (error) {
            console.error(
              `Erreur lors de l'envoi du message dans ${channel.name} :`,
              error
            );
          }
        }, intervalMs);

        loops.set(channel.id, loop);

        // Log de succès
        console.log(`✅ Boucle démarrée :`, {
          channel: channel.name,
          message: message,
          interval: `${interval} secondes`,
        });

        return interaction.reply({
          content: `✅ La boucle a été démarrée dans le salon ${channel} avec un intervalle de ${interval} secondes.`,
          flags: 64, // Réponse éphémère
        });
      } else if (action === "stop") {
        if (!loops.has(channel.id)) {
          return interaction.reply({
            content: "❌ Aucune boucle n'est en cours dans ce salon.",
            flags: 64, // Réponse éphémère
          });
        }

        // Arrêter la boucle
        clearInterval(loops.get(channel.id));
        loops.delete(channel.id);

        // Log de succès
        console.log(`✅ Boucle arrêtée :`, {
          channel: channel.name,
        });

        return interaction.reply({
          content: `✅ La boucle a été arrêtée dans le salon ${channel}.`,
          flags: 64, // Réponse éphémère
        });
      }
    } catch (error) {
      // Ajout de détails sur la commande dans le débogage
      console.error("Erreur dans la commande customloop :", {
        action: interaction.options.getString("action"),
        channel: interaction.options.getChannel("salon")?.id || "Inconnu",
        message: interaction.options.getString("message") || "/bump",
        interval: interaction.options.getInteger("intervalle") || 7200,
        error: error.message,
      });

      return interaction.reply({
        content:
          "❌ Une erreur est survenue lors de l'exécution de la commande.",
        flags: 64, // Réponse éphémère
      });
    }
  },
};
