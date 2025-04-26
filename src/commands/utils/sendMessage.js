const { SlashCommandBuilder, EmbedBuilder, MessageFlagsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmessage")
    .setDescription("Envoie un message ou un embed dans un canal.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type de message à envoyer (texte ou embed)")
        .setRequired(true)
        .addChoices(
          { name: "Texte", value: "text" },
          { name: "Embed", value: "embed" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("contenu")
        .setDescription("Le contenu du message ou de l'embed.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("titre")
        .setDescription("Le titre de l'embed.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("couleur")
        .setDescription("La couleur de l'embed (en hexadécimal, ex: #0099ff).")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("URL de l'image à inclure dans l'embed.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription("Texte du footer de l'embed.")
        .setRequired(false)
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      const type = interaction.options.getString("type");

      if (type === "text") {
        const content = interaction.options.getString("contenu");
        if (!content) {
          return interaction.reply({
            content: "Vous devez fournir un contenu pour le message texte.",
            flags: MessageFlagsBitField.Flags.Ephemeral, // Utilisez flags au lieu de ephemeral
          });
        }
        await interaction.reply({ content: content });
      } else if (type === "embed") {
        const title = interaction.options.getString("titre");
        const description = interaction.options.getString("contenu");
        let color = interaction.options.getString("couleur") || "#0099ff";
        const image = interaction.options.getString("image");
        const footer = interaction.options.getString("footer");

        // Vérifiez si la couleur est valide
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
          color = "#0099ff"; // Couleur par défaut si la couleur est invalide
        }

        const embed = new EmbedBuilder().setColor(color);

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (image) embed.setImage(image);
        if (footer) embed.setFooter({ text: footer });

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Une erreur est survenue lors de l'envoi du message.",
        ephemeral: true,
      });
    }
  },
};