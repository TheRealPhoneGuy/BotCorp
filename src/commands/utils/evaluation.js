const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlagsBitField,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("evaluation")
    .setDescription("✨ Envoye le bilan de l'evaluation d'un server")
    .setDMPermission(false)
    .setIntegrationTypes(
      ApplicationIntegrationType.UserInstall,
      ApplicationIntegrationType.GuildInstall
    )
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .addStringOption((opt) =>
      opt
        .setName("server")
        .setDescription("Le nom du serveur évalué")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("thème")
        .setDescription("Le thème du serveur évalué")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("invitation")
        .setDescription("Le CODE de l'invitation du serveur évalué")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("certification")
        .setDescription("Est-ce un serveur certifié ? (Oui/Non)")
        .setRequired(true)
    )
    .addNumberOption((opt) =>
      opt.setName("note").setDescription("La note du serveur").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("description")
        .setDescription("La description de la note du serveur évalué")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      const { options } = interaction;
      const channel = interaction.client.channels.cache.get(
        "1358027513867014324"
      );

      channel.send(`
- __Nom du serveur:__ **${options.getString("server")}**
- __Thème du serveur:__ **${options.getString("thème")}**
- __Invitation:__ [Rejoindre le serveur](<https://discord.gg/${options.getString(
        "invitation"
      )}>)
- __Evaluateur:__ **${interaction.user}**

> **<:verifie:1357835190453534922> Niveau de certification:  ${
        options.getString("certification") === "Oui"
          ? "<:check:1359519738299940964>"
          : "<:negatif:1359519838598332598>"
      } **

<:fleche_droite:1328460868425351210> __Note:__ **${options.getNumber(
        "note"
      )}/20**
<:fleche_droite:1328460868425351210> __Commentaire:__ **${options.getString(
        "description"
      )}**`);

      const embed = new EmbedBuilder()
      .setDescription("Evaluation envoyé!")
      interaction.reply({
        embeds: [embed],
        flags: MessageFlagsBitField.Flags.Ephemeral, // Utilisez flags pour les réponses éphémères
      });
    } catch (error) {
      console.error(error);
    }
  },
};
