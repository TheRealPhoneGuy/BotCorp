const { Events, ChannelType, WebhookClient } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,

  async run(client, message) {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
      const modmailCache = client.modmailCache || new Map();
      client.modmailCache = modmailCache;

      if (modmailCache.has(message.author.id)) {
        const webhook = new WebhookClient({
          url: modmailCache.get(message.author.id).webhookURL,
        });
        await webhook.send(message.content);
      } else {
        const guild = client.guilds.cache.get("875659838842085376");
        const channel = await guild.channels.create({
          name: `ticket-${message.author.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: ["SendMessages", "ViewChannel", "ReadMessageHistory"],
            },
            {
              id: message.author.id,
              allow: [
                "SendMessages",
                "ViewChannel",
                "ReadMessageHistory",
                "EmbedLinks",
                "AttachFiles",
              ],
            },
          ],
        });

        const webhook = await channel.createWebhook({
          name: message.author.username,
          avatar: message.author.displayAvatarURL(),
        });

        modmailCache.set(message.author.id, {
          channelID: channel.id,
          webhookURL: webhook.url,
        });

        await webhook.send(message.content);
        await message.reply("Votre demande a bien été soumise !");
      }
    } else {
      const modmailCache = client.modmailCache || new Map();
      const ticket = Array.from(modmailCache.values()).find(
        (ticket) => ticket.channelID === message.channel.id
      );

      if (ticket) {
        const user = await client.users.fetch(ticket.userID);
        if (message.content.startsWith(".finish")) {
          await user.send("Votre demande a été fermée.");
          await message.channel.delete();
          modmailCache.delete(ticket.userID);
        } else {
          await user.send(
            `**${message.author.username}** : ${message.content}`
          );
        }
      }
    }
  },
};
