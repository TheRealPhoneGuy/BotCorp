const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const filePath = path.resolve(__dirname, "../../../autoreact.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoreactsetup")
    .setDescription("Configurer les autoreacts pour un salon.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Ajouter un autoreact.")
        .addChannelOption((opt) =>
          opt.setName("salon").setDescription("Le salon ou activer l'autoreact.").setRequired(true)
        )
        .addStringOption((opt) =>
          opt.setName("mot").setDescription("Le mot auquel réagir.").setRequired(true)
        )
        .addStringOption((opt) =>
          opt.setName("emoji").setDescription("L'emoji a utiliser dans la réaction.").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("Afficher tous les autoreacts.")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Supprimer un autoreact.")
        .addNumberOption((opt) =>
          opt.setName("index").setDescription("Index à supprimer.").setRequired(true)
        )
    ),

  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let autoreacts = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : [];

    if (subcommand === "add") {
      const channel = interaction.options.getChannel("salon");
      const word = interaction.options.getString("mot");
      const emoji = interaction.options.getString("emoji");

      autoreacts.push({ channelId: channel.id, word, emoji });
      fs.writeFileSync(filePath, JSON.stringify(autoreacts, null, 2));

      return interaction.reply({
        content: `✅ Autoreact ajouté : Salon <#${channel.id}>, Mot "${word}", Emoji ${emoji}`,
        ephemeral: true,
      });
    }

    if (subcommand === "list") {
      if (autoreacts.length === 0) {
        return interaction.reply({ content: "❌ Aucun autoreact configuré.", ephemeral: true });
      }

      const list = autoreacts
        .map((ar, index) => `**${index}** - Salon : <#${ar.channelId}>, Mot : "${ar.word}", Emoji : ${ar.emoji}`)
        .join("\n");

      return interaction.reply({ content: `📋 Liste des autoreacts :\n\n${list}`, ephemeral: true });
    }

    if (subcommand === "remove") {
      const index = interaction.options.getNumber("index");

      if (index < 0 || index >= autoreacts.length) {
        return interaction.reply({ content: "❌ Index invalide.", ephemeral: true });
      }

      const removed = autoreacts.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(autoreacts, null, 2));

      return interaction.reply({
        content: `✅ Autoreact supprimé : Salon <#${removed[0].channelId}>, Mot "${removed[0].word}", Emoji ${removed[0].emoji}`,
        ephemeral: true,
      });
    }
  },
};