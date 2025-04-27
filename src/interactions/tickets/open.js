const {
  ComponentType,
  ButtonBuilder,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField,
  ButtonStyle,
  MessageFlagsBitField,
} = require("discord.js");
const CAT = process.env.TICKET_CATEGORY_ID; // ID de la catégorie où les tickets seront créés

module.exports = {
  name: "open-ticket",
  type: ComponentType.Button,

  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async run(interaction) {
    // Vérifiez si le bot a les permissions nécessaires
    if (!interaction.guild.members.me.permissions.has("ManageChannels")) {
      return interaction.reply({
        content: "❌ Je n'ai pas la permission de gérer les canaux.",
        ephemeral: true,
      });
    }

    const channelName = `ticket-${interaction.user.username.toLowerCase()}`;

    // Vérifiez si un ticket existe déjà pour cet utilisateur
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

    // Créez un nouveau canal pour le ticket
    const channel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: CAT, // Placez le canal dans la catégorie spécifiée
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone, // Tout le monde
          deny: [PermissionsBitField.Flags.ViewChannel], // Interdire la vue du canal
        },
        {
          id: interaction.user.id, // L'utilisateur qui a ouvert le ticket
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ], // Autoriser la vue et l'envoi de messages
        },
      ],
    });

    // Créez un bouton pour fermer le ticket
    const closeBtn = new ButtonBuilder()
      .setCustomId("close-ticket")
      .setLabel("🔒 Fermer le ticket")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeBtn);

    // Envoyez un message dans le canal du ticket
    await channel.send({
      content: `🎫 Ticket ouvert par ${interaction.user}`,
      components: [row],
    });

    // Répondez à l'utilisateur pour confirmer la création du ticket
    await interaction.reply({
      content: `✅ Ticket créé ici : ${channel}`,
      components: [],
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });
  },
};
