const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandSubcommandGroupBuilder,
  MessageFlagsBitField,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "⏳ Afficher la latence du bot, de l'API, et de la base de données."
    )
    .setDMPermission(true)
    .setIntegrationTypes(
      ApplicationIntegrationType.UserInstall,
      ApplicationIntegrationType.GuildInstall
    )
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  category: "🔧 - Utilitaire",
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.UseExternalEmojis,
  ],

  async run(interaction) {
    try {
      const start = Date.now();
      // Effectuer une requête simple à la base de données pour mesurer la latence

      const embed = new EmbedBuilder()
        .setDescription(`# \`🏓\` Pong !\n*Nous calculons encore mon ping...*`)
        .setColor("Red");

      interaction
        .reply({
          embeds: [embed],
          flags: MessageFlagsBitField.Flags.Ephemeral,
        })
        .then((msg) => {
          const messageLatency = Date.now() - start;
          embed.setDescription(
            `# \`🏓\` Pong !\nMon ping : \`${messageLatency}ms\`\nPing de l'API : \`${interaction.client.ws.ping}ms\``
          );

          msg.edit({
            embeds: [embed],
          });
        });
    } catch (error) {
      console.log(error);
    }
  },
};
