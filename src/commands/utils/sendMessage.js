const { SlashCommandBuilder, EmbedBuilder, MessageFlagsBitField, PermissionFlagsBits } = require("discord.js");

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
        .setDescription(
          "Choisissez une couleur (rouge, bleu, vert) ou un code hexadécimal (#0099ff)."
        )
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: "🔧 - Utilitaire",    
  

  async run(interaction) {
    try {
      const type = interaction.options.getString("type");
    
      // Vérifier les permissions
      if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        return interaction.reply({
          content: "❌ Vous n'avez pas les permissions nécessaires pour utiliser cette commande.",
          ephemeral: true,
        });
      }
      
      if (type === "text") {
        const content = interaction.options.getString("contenu");
        if (!content) {
          return interaction.reply({
            content: "Vous devez fournir un contenu pour le message texte.",
            flags: MessageFlagsBitField.Flags.Ephemeral,
          });
        }
        await interaction.reply({ content: content });
      } else if (type === "embed") {
        const title = interaction.options.getString("titre");
        let description = interaction.options.getString("contenu");
        let color = interaction.options.getString("couleur") || "#0099ff";
        const image = interaction.options.getString("image");
        const footer = interaction.options.getString("footer");

        // Définir les couleurs de base
        const baseColors = {
          rouge: "#FF0000",
          bleu: "#0099FF",
          vert: "#00FF00",
        };

        // Vérifiez si la couleur est une couleur de base ou un code hexadécimal valide
        if (baseColors[color.toLowerCase()]) {
          color = baseColors[color.toLowerCase()];
        } else if (!/^#[0-9A-F]{6}$/i.test(color)) {
          color = "#0099ff"; // Couleur par défaut si la couleur est invalide
        }

        // Fournir une description par défaut si elle est manquante
        if (!description) {
          description = "Aucune description fournie.";
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
        flags: MessageFlagsBitField.Flags.Ephemeral, // Utilisation de MessageFlagsBitField
      });
    }
  },
};