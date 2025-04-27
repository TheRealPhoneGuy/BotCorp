const { Events } = require("discord.js");
const { bannedWords, allowedRoles } = require("../../commands/utils/banWord");

module.exports = {
  name: Events.MessageCreate,

  async run(client, message) {
    try {
      if (message.author.bot) return; // Ignorer les messages des bots

      // Vérifier si `message.member` est valide
      if (!message.member) return;

      const userRoles = message.member.roles.cache.map((role) => role.id);

      // Vérifier si l'utilisateur a un rôle autorisé
      const isAllowed = userRoles.some((roleId) => allowedRoles.has(roleId));
      if (isAllowed) return;

      // Vérifier si le message contient un mot banni
      const words = message.content.toLowerCase().split(/\s+/);
      const foundWord = words.find((word) => bannedWords.has(word));

      if (foundWord) {
        // Vérifier si le bot a la permission de gérer les messages
        if (!message.guild.me.permissions.has("ManageMessages")) {
          console.error("Le bot n'a pas la permission de gérer les messages.");
          return;
        }

        // Vérifier si le bot a la permission d'envoyer des messages
        if (!message.channel.permissionsFor(message.guild.members.me).has("SendMessages")) {
          console.error(`Le bot n'a pas la permission d'envoyer des messages dans le canal ${message.channel.name}`);
          return;
        }

        await message.reply({
          content: `⚠️ Attention ${message.author}, le mot "${foundWord}" est interdit sur ce serveur.`,
        });
      }
    } catch (error) {
      console.error("Erreur dans l'événement MessageCreate :", error);
    }
  },
};