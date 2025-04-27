const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("📢 Signaler un bug ou un problème.")
    .addStringOption((option) =>
      option
        .setName("motif")
        .setDescription("Le motif du rapport (exemple : bug, suggestion, etc.).")
        .setRequired(true)
        .addChoices(
          { name: "Bug", value: "Bug" },
          { name: "Suggestion", value: "Suggestion" },
          { name: "Autre", value: "Autre" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("contenu")
        .setDescription("Décrivez le problème ou la suggestion.")
        .setRequired(true)
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      const motif = interaction.options.getString("motif");
      const contenu = interaction.options.getString("contenu");
      const bugReportChannelId = process.env.BUG_REPORT_CHANNEL_ID;

      // Vérifiez si le salon est défini dans .env
      if (!bugReportChannelId) {
        return interaction.reply({
          content: "❌ Le salon pour les rapports de bugs n'est pas configuré.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const channel = interaction.client.channels.cache.get(bugReportChannelId);

      // Vérifiez si le salon existe
      if (!channel) {
        return interaction.reply({
          content: "❌ Le salon pour les rapports de bugs est introuvable.",
          flags: MessageFlags.Ephemeral,
        });
      }

      // Créez un embed pour le rapport de bug
      const embed = new EmbedBuilder()
        .setTitle("📢 Nouveau rapport de bug")
        .setColor("Red")
        .addFields(
          { name: "Motif", value: motif, inline: true },
          { name: "Auteur", value: `${interaction.user.tag}`, inline: true },
          { name: "Contenu", value: contenu }
        )
        .setFooter({
          text: `ID de l'utilisateur : ${interaction.user.id}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Envoyer l'embed dans le salon public
      await channel.send({ embeds: [embed] });

      // Répondre à l'utilisateur pour confirmer l'envoi
      return interaction.reply({
        content: "✅ Votre rapport a été envoyé avec succès.",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Erreur dans la commande /reportbug :", error);
      return interaction.reply({
        content: "❌ Une erreur est survenue lors de l'envoi de votre rapport.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription("📢 Signaler un bug ou un problème technique au développeur.")
    .addStringOption((option) =>
      option
        .setName("contenu")
        .setDescription("Décrivez le bug rencontré.")
        .setRequired(true)
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      const contenu = interaction.options.getString("contenu");
      const bugReportChannelId = process.env.BUG_REPORT_CHANNEL_ID;

      // Vérifiez si le salon est défini dans .env
      if (!bugReportChannelId) {
        return interaction.reply({
          content: "❌ Le salon pour les rapports de bugs n'est pas configuré.",
          flags: MessageFlags.Ephemeral, // Utilisation de flags au lieu de ephemeral
        });
      }

      const channel = interaction.client.channels.cache.get(bugReportChannelId);

      // Vérifiez si le salon existe
      if (!channel) {
        return interaction.reply({
          content: "❌ Le salon pour les rapports de bugs est introuvable.",
          flags: MessageFlags.Ephemeral, // Utilisation de flags au lieu de ephemeral
        });
      }

      // Créez un embed pour le rapport de bug
      const embed = new EmbedBuilder()
        .setTitle("📢 Nouveau rapport de bug")
        .setColor("Red")
        .addFields(
          { name: "Auteur", value: `${interaction.user.tag}`, inline: true },
          { name: "Contenu", value: contenu }
        )
        .setFooter({
          text: `ID de l'utilisateur : ${interaction.user.id}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      // Envoyer l'embed dans le salon public
      await channel.send({ embeds: [embed] });

      // Répondre à l'utilisateur pour confirmer l'envoi
      return interaction.reply({
        content: "✅ Votre rapport de bug a été envoyé avec succès au développeur.",
        flags: MessageFlags.Ephemeral, // Utilisation de flags au lieu de ephemeral
      });
    } catch (error) {
      console.error("Erreur dans la commande /reportbug :", error);
      return interaction.reply({
        content: "❌ Une erreur est survenue lors de l'envoi de votre rapport.",
        flags: MessageFlags.Ephemeral, // Utilisation de flags au lieu de ephemeral
      });
    }
  },
};