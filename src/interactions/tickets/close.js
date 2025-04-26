const { ComponentType, MessageFlagsBitField } = require("discord.js");

module.exports = {
  name: "close-ticket",
  type: ComponentType.Button,

  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async run(interaction) {
    await interaction.reply({
      content: "🔒 Ce ticket sera fermé dans 5 secondes...",
      flags: MessageFlagsBitField.Flags.Ephemeral,
    });
    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 5000);
  },
};
