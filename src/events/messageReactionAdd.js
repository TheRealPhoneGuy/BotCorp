const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",

  async execute(reaction, user) {
    try {
      console.log(`📩 Réaction détectée : ${reaction.emoji.name} par ${user.tag}`);

      // Ignorer les réactions des bots
      if (user.bot) return;

      // Récupérer la réaction si elle est partielle
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error("❌ Impossible de récupérer la réaction :", error);
          return;
        }
      }

      const starboardChannelId = process.env.STARBOARD_CHANNEL_ID;
      const starboardThreshold = parseInt(process.env.STARBOARD_THRESHOLD, 10) || 5;

      // Vérifier si le canal Starboard est configuré
      if (!starboardChannelId) {
        console.error("❌ Le canal Starboard n'est pas configuré dans .env.");
        return;
      }

      const starboardChannel = reaction.message.guild.channels.cache.get(starboardChannelId);

      // Vérifier si le canal Starboard existe et si le bot a les permissions nécessaires
      if (!starboardChannel) {
        console.error("❌ Le canal Starboard est introuvable ou inaccessible.");
        return;
      }

      if (!starboardChannel.permissionsFor(reaction.message.guild.me).has("SendMessages")) {
        console.error("❌ Le bot n'a pas la permission d'envoyer des messages dans le canal Starboard.");
        return;
      }

      // Vérifier si l'emoji est une étoile
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

      // Créer un embed pour le message Starboard
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
        } else {
          console.log("❌ La pièce jointe n'est pas une image. Ignorée.");
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