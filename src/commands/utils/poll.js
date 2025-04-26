const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Crée un sondage dans un canal.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("La question du sondage.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription(
          "Les choix du sondage, séparés par des virgules (max 10 choix)."
        )
        .setRequired(true)
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      if (!interaction.member.permissions.has("ManageMessages")) {
        return interaction.reply({
          content: "❌ Vous n'avez pas la permission de créer un sondage.",
          flags: 64, // Réponse éphémère
        });
      }

      const question = interaction.options.getString("question");
      const options = interaction.options
        .getString("options")
        .split(",")
        .map((opt) => opt.trim());

      // Vérifier le nombre d'options
      if (options.length < 2 || options.length > 10) {
        return interaction.reply({
          content: "❌ Vous devez fournir entre 2 et 10 options.",
          flags: 64, // Réponse éphémère
        });
      }

      // Emojis pour les votes
      const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

      // Construire l'embed du sondage
      const embed = new EmbedBuilder()
        .setTitle("📊 Sondage")
        .setDescription(`**${question}**\n\n${options
          .map((opt, index) => `${emojis[index]} ${opt}`)
          .join("\n")}`)
        .setColor("#0099ff")
        .setFooter({
          text: `Créé par ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      // Envoyer le sondage
      const pollMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true, // Nécessaire pour récupérer le message
      });

      // Ajouter les réactions pour voter
      for (let i = 0; i < options.length; i++) {
        await pollMessage.react(emojis[i]);
      }
    } catch (error) {
      console.error("Erreur lors de la création du sondage :", error);
      await interaction.reply({
        content: "❌ Une erreur est survenue lors de la création du sondage.",
        flags: 64, // Réponse éphémère
      });
    }
  },
};