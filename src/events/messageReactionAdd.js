const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",

  async execute(reaction, user) {
    try {
      // Ignorer les réactions des bots
      if (user.bot) return;

      const starboardChannelId = process.env.STARBOARD_CHANNEL_ID;
      const starboardThreshold = parseInt(process.env.STARBOARD_THRESHOLD, 10) || 5;

      // Vérifier si le canal Starboard est configuré
      if (!starboardChannelId) {
        console.error("❌ Le canal Starboard n'est pas configuré dans .env.");
        return;
      }

      const starboardChannel = reaction.message.guild.channels.cache.get(starboardChannelId);

      // Vérifier si le canal Starboard existe
      if (!starboardChannel) {
        console.error("❌ Le canal Starboard est introuvable.");
        return;
      }

      // Vérifier si l'emoji est une étoile (Discord utilise :star:)
      if (reaction.emoji.name !== "⭐" && reaction.emoji.name !== "star") {
        console.log("❌ Réaction ignorée car ce n'est pas une étoile.");
        return;
      }

      // Vérifier si le nombre de réactions atteint le seuil
      if (reaction.count < starboardThreshold) {
        console.log(`❌ Réaction ignorée car le seuil (${starboardThreshold}) n'est pas atteint.`);
        return;
      }

      console.log("✅ Le seuil de réactions est atteint. Préparation de l'embed...");

      // Vérifier si le message est déjà dans le Starboard
      const fetchedMessages = await starboardChannel.messages.fetch({ limit: 100 });
      const alreadyStarred = fetchedMessages.find((msg) =>
        msg.embeds.length > 0 &&
        msg.embeds[0].footer &&
        msg.embeds[0].footer.text === `ID du message : ${reaction.message.id}`
      );

      if (alreadyStarred) {
        console.log("❌ Le message est déjà dans le Starboard.");
        return;
      }

      // Créez un embed pour le message Starboard
      const embed = new EmbedBuilder()
        .setColor("Gold")
        .setAuthor({
          name: reaction.message.author.tag,
          iconURL: reaction.message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(reaction.message.content || "[Message sans texte]")
        .addFields(
          { name: "Lien vers le message", value: `[Aller au message](${reaction.message.url})` }
        )
        .setFooter({ text: `ID du message : ${reaction.message.id}` })
        .setTimestamp();

      // Ajouter une image si le message contient une pièce jointe
      if (reaction.message.attachments.size > 0) {
        const attachment = reaction.message.attachments.first();
        if (attachment.contentType && attachment.contentType.startsWith("image/")) {
          embed.setImage(attachment.url);
        }
      }

      // Envoyer l'embed dans le canal Starboard
      await starboardChannel.send({ embeds: [embed] });
      console.log("✅ Message ajouté au Starboard.");
    } catch (error) {
      console.error("❌ Erreur dans l'événement messageReactionAdd :", error);
    }
  },
};