require('dotenv').config(); // Charger les variables d'environnement

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
    .setName("setup-ticket")
    .setDescription("🎫 Envoye le interaction d'ouverture de ticket.")
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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "🎫 - Tickets",
  permissions: [
    PermissionFlagsBits.Sendinteractions,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.ReadinteractionHistory,
    PermissionFlagsBits.UseExternalEmojis,
  ],

  async run(interaction) {
    try {
      const embed = new EmbedBuilder().setColor("Red");

      const openBtn = new ButtonBuilder()
        .setCustomId("open-ticket")
        .setLabel("🎫 Créer un Ticket")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(openBtn);

      interaction.reply({
        embeds: [embed.setDescription(`### \`🎫\` Message envoyé.`)],
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });

      await interaction.channel.send({
        embeds: [
          embed
            .setDescription(
              `# \`🎫\` Ouvrez un ticket.
Clique sur le bouton ci-dessous pour ouvrir un ticket.
-# *Merci de ne pas spam les tickets & __**1**__ ticket par __problème__*`
            )
            .setImage(process.env.SUPPORT_IMAGE_URL) // Utiliser l'URL depuis .env
            .setFooter({
              text: `DisCorp FR © ${String(new Date().getFullYear())}`,
              iconURL: interaction.guild.iconURL(),
            }),
        ],
        components: [row],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
