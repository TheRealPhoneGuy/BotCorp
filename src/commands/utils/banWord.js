const { SlashCommandBuilder } = require("discord.js");

const bannedWords = new Set(); // Liste des mots bannis
const allowedRoles = new Set(); // Liste des rôles autorisés

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banword")
    .setDescription("Gérer les mots bannis et les rôles autorisés.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Ajouter un mot à la liste des mots bannis.")
        .addStringOption((option) =>
          option
            .setName("mot")
            .setDescription("Le mot à bannir.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Supprimer un mot de la liste des mots bannis.")
        .addStringOption((option) =>
          option
            .setName("mot")
            .setDescription("Le mot à supprimer.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("allowrole")
        .setDescription("Ajouter un rôle autorisé.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Le rôle à autoriser.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removerole")
        .setDescription("Supprimer un rôle autorisé.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Le rôle à supprimer.")
            .setRequired(true)
        )
    ),
  category: "🔧 - Utilitaire",

  async run(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "add") {
        const word = interaction.options.getString("mot").toLowerCase();
        if (bannedWords.has(word)) {
          return interaction.reply({
            content: `❌ Le mot "${word}" est déjà dans la liste des mots bannis.`,
            flags: 64,
          });
        }
        bannedWords.add(word);
        return interaction.reply({
          content: `✅ Le mot "${word}" a été ajouté à la liste des mots bannis.`,
          flags: 64,
        });
      }

      if (subcommand === "remove") {
        const word = interaction.options.getString("mot").toLowerCase();
        if (!bannedWords.has(word)) {
          return interaction.reply({
            content: `❌ Le mot "${word}" n'est pas dans la liste des mots bannis.`,
            flags: 64,
          });
        }
        bannedWords.delete(word);
        return interaction.reply({
          content: `✅ Le mot "${word}" a été supprimé de la liste des mots bannis.`,
          flags: 64,
        });
      }

      if (subcommand === "allowrole") {
        const role = interaction.options.getRole("role");
        if (allowedRoles.has(role.id)) {
          return interaction.reply({
            content: `❌ Le rôle "${role.name}" est déjà autorisé.`,
            flags: 64,
          });
        }
        allowedRoles.add(role.id);
        return interaction.reply({
          content: `✅ Le rôle "${role.name}" a été ajouté à la liste des rôles autorisés.`,
          flags: 64,
        });
      }

      if (subcommand === "removerole") {
        const role = interaction.options.getRole("role");
        if (!allowedRoles.has(role.id)) {
          return interaction.reply({
            content: `❌ Le rôle "${role.name}" n'est pas dans la liste des rôles autorisés.`,
            flags: 64,
          });
        }
        allowedRoles.delete(role.id);
        return interaction.reply({
          content: `✅ Le rôle "${role.name}" a été supprimé de la liste des rôles autorisés.`,
          flags: 64,
        });
      }
    } catch (error) {
      console.error("Erreur dans la commande banword :", error);
      return interaction.reply({
        content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
        flags: 64,
      });
    }
  },
  bannedWords,
  allowedRoles,
};