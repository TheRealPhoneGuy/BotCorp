const {
  Events,
  InteractionType,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const cooldowns = new Map();

module.exports = {
  name: Events.InteractionCreate,

  async run(client, interaction) {
    try {
      // === Slash Commands ===
      if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          const embed = new EmbedBuilder()
            .setColor(await getColor(interaction))
            .setDescription(
              `**\`🧐\` Hello \`${interaction.user.username}\`, il semble que cette commande n'existe plus.**\n-# *Prenez une capture d'écran, c'est rare !*`
            )
            .setFooter({
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              text: `Demandé par ${interaction.user.username}`,
            });

          return interaction.reply({
            embeds: [embed],
            flags: MessageFlagsBitField.Flags.Ephemeral,
          });
        }

        // Cooldown système
        const cooldown = (command.cooldown || 5) * 1000;
        const key = `${interaction.user.id}_${interaction.commandName}`;
        const now = Date.now();

        if (cooldowns.has(key)) {
          const expiration = cooldowns.get(key);
          const timeLeft = expiration - now;

          if (timeLeft > 0) {
            const timestamp = Math.floor((now + timeLeft) / 1000);
            const embed = new EmbedBuilder()
              .setColor(await getColor(interaction))
              .setDescription(
                `\`⏲️\` **Tu dois attendre encore <t:${timestamp}:R> avant d'utiliser cette commande.**`
              );

            return interaction.reply({
              embeds: [embed],
              flags: MessageFlagsBitField.Flags.Ephemeral,
            });
          }
        }

        cooldowns.set(key, now + cooldown);
        setTimeout(() => cooldowns.delete(key), cooldown);

        if (command.run) return command.run(interaction);
      }

      // === Message Components (boutons, menus...) ===
      if (interaction.type === InteractionType.MessageComponent) {
        if (!interaction.customId) return;

        const [name, ...args] = interaction.customId.split("_");
        const component = client.interactions.find(
          (c) => c.name === name && c.type === interaction.componentType
        );

        if (!component) return;

        // Vérification permissions
        if (
          component.permissions &&
          !interaction.member.permissions.has(
            new PermissionsBitField(component.permissions)
          )
        ) {
          return interaction.reply({
            content: `Tu n'as pas la permission requise \`${new PermissionsBitField(
              component.permissions
            )
              .toArray()
              .join(", ")}\` pour utiliser ce composant.`,
            flags: MessageFlagsBitField.Flags.Ephemeral,
          });
        }

        return component.run(interaction, ...args);
      }

      // === Context Menus ===
      if (interaction.isContextMenuCommand?.()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          const embed = new EmbedBuilder()
            .setColor(await getColor(interaction))
            .setDescription(
              `**\`🧐\` Hello \`${interaction.user.username}\`, cette commande contextuelle semble ne plus exister.**`
            )
            .setFooter({
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              text: `Demandé par ${interaction.user.username}`,
            });

          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        return command.run(interaction);
      }

      // === Menus déroulants (StringSelectMenu) ===
      if (interaction.isStringSelectMenu?.()) {
        const [name, ...args] = interaction.customId.split("_");
        const component = client.interactions.find(
          (c) => c.name === name && c.type === "SELECT_MENU"
        );

        if (!component) return;
        return component.run(interaction, ...args);
      }
    } catch (error) {
      console.log(error);
      if (!interaction.replied)
        interaction
          .reply({
            content:
              "Une erreur est survenue lors de l'exécution de l'interaction.",
            flags: MessageFlagsBitField.Flags.Ephemeral,
          })
          .catch(() => {});
    }
  },
};
