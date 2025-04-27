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
Clique sur le buton ci-dessous pour ouvrir un ticket.
-# *Merci de ne pas spam les tickets & __**1**__ ticket par __problème__*`
            )
            .setImage(
              "https://media.discordapp.net/attachments/1285638581343228046/1365261944642080859/Image_Support.png?ex=680f4dc4&is=680dfc44&hm=e719ba7ccaf2385f6b17dd599baa2f837ac2555561c41d155bf7934d59b81406&=&format=webp&quality=lossless&width=1783&height=949"
            )
            .setFooter({
              text: `DisCorp FR © ${String(new Date().getFullYear())}`, // L’équipe TerraNova vous répondra dès que possible 👨‍💻
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
