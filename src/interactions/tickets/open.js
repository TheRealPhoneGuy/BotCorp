const {
  ComponentType,
  ButtonBuilder,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
  ButtonStyle,
  StringSelectMenuBuilder,
  MessageFlagsBitField,
} = require("discord.js");
const CAT = "1365744417595723888";

module.exports = {
  name: "open-ticket",
  type: ComponentType.Button,

  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async run(interaction) {
    if (!interaction.guild.me.permissions.has("ManageChannels")) {
      return interaction.reply({
        content: "Je n'ai pas la permission de gérer les canaux.",
        ephemeral: true,
      });
    }

    const channelName = `ticket-${interaction.user.username.toLowerCase()}`;

    const existing = interaction.guild.channels.cache.find(
      (c) => c.name === channelName
    );
    if (existing) {
      await interaction.reply({
        content: "❌ Tu as déjà un ticket ouvert.",
        components: [],
        flags: MessageFlagsBitField.Flags.Ephemeral,
      });
      return;
    }

    const channel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: CAT,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    const closeBtn = new ButtonBuilder()
      .setCustomId("close-ticket")
      .setLabel("🔒 Fermer le ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeBtn);

    await channel.send({
      content: `🎫 Ticket ouvert par ${interaction.user}`,
      components: [row],
    });

    await interaction.reply({
      content: `✅ Ticket créé ici : ${channel}`,
      components: [],
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });
  },
};
